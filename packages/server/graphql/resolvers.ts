import jwt, { Algorithm } from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import OpenAI from 'openai';
import {
  generateRegistrationOptions,
  verifyRegistrationResponse,
  generateAuthenticationOptions,
  verifyAuthenticationResponse,
} from '@simplewebauthn/server';
// import { Fido2Lib } from 'fido2-lib';
// import { coerceToArrayBuffer, coerceToBase64Url } from 'fido2-lib/lib/utils';
import User from '..//models/user';
import Token from '../models/token';
import Chat from '../models/chat';

dotenv.config({ path: '../../.env' });
const { JWT_SECRET, NODE_ENV, OPENAI_API_KEY } = process.env;

const openai = new OpenAI({
  apiKey: OPENAI_API_KEY,
});
console.log(NODE_ENV, 24);

// const rp = NODE_ENV === 'production' ? 'https://peacefulstar.art' : 'localhost';
//
// const f2l = new Fido2Lib({
//   timeout: 6000,
//   rpId: rp,
//   rpName: 'ACME',
//   challengeSize: 128,
//   attestation: 'direct',
//   cryptoParams: [-7, -257, -35, -36, -258, -259, -37, -38, -39, -8],
//   authenticatorAttachment: 'platform',
//   authenticatorRequireResidentKey: false,
//   authenticatorUserVerification: 'required',
// });

const cookieOpts = {
  path: '/',
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
};

const isValidToken = (str: string): boolean => {
  console.log(str, 62);
  if (str) {
    try {
      const token: any = JSON.parse(str);
      console.log(jwt.verify(token, JWT_SECRET as Algorithm), 66);
      return !!jwt.verify(token, JWT_SECRET as Algorithm);
    } catch (err) {
      return false;
    }
  }
  return false;
};

const getStatus = (token: string, tokens: string[]): number => {
  return isValidToken(token) && tokens.length === 0 ? 200 : 401;
};

const resolvers = {
  Query: {
    async getUser(_: any, args: any): Promise<object> {
      const {
        input: { email },
      } = args;
      return User.findOne({ email }) as any;
    },
    async generateRegistration(_: any, _args: any, ctx: any): Promise<object> {
      const token = ctx.req.cookies['x-access-token'];
      const result: any = jwt.verify(
        JSON.parse(token),
        JWT_SECRET as Algorithm,
      );

      const url = ctx.req.protocol + '://' + ctx.req.get('host');
      console.log(ctx.req.protocol, 79);
      console.log(ctx.req.hostname, 80);
      // console.log(ctx.req.get('host'), 81);
      console.log(result, 82);

      // const id = result.id;
      // const email = result.email;
      let obj;
      if (result) {
        const options = generateRegistrationOptions({
          rpName: 'PeacefulStar',
          rpID: ctx.req.hostname,
          userID: result.id,
          userName: result.email,
          // userDisplayName: user.displayName,
          timeout: 300000,
          attestationType: 'none',
          // excludeCredentials,
          authenticatorSelection: {
            residentKey: 'discouraged',
          },
          supportedAlgorithmIDs: [
            -7, -257, -35, -36, -258, -259, -37, -38, -39, -8,
          ],
          // extensions,
        });

        await options
          .then((res) => {
            obj = res;
          })
          .catch((err) => {
            throw new Error(err);
          });
      }

      return { options: obj, url: url };
    },
    async isAuthenticated(_: any, _args: any, ctx: any): Promise<object> {
      // console.log(ctx.req, 94);
      const token: string = ctx.req.cookies['x-access-token'];
      const tokens: string[] = await Token.find({ tags: token });
      const status: number = getStatus(
        ctx.req.cookies['x-access-token'],
        tokens,
      );

      if (status === 401) {
        if (token) {
          const newToken = new Token();
          newToken.tags.push(token);
          await newToken.save();
        }
        ctx.res.clearCookie('x-access-token');
      }
      return { status };
    },
  },
  Mutation: {
    createUser: async (_: any, args: any, ctx: any): Promise<object> => {
      const {
        input: { name, email },
      } = args;
      // const salt = bcrypt.genSaltSync(10);

      try {
        const user = await User.create({
          name,
          email,
          // password: bcrypt.hashSync(password, salt),
        });

        const token = jwt.sign(
          { id: user.id, email: user.email },
          JWT_SECRET as Algorithm,
          { expiresIn: '1d' },
        );

        ctx.res.cookie('x-access-token', JSON.stringify(token), cookieOpts);
        return { token };
      } catch (error: any) {
        throw new Error(error.message);
      }
    },
    signInUser: async (_: any, args: any, ctx: any): Promise<object> => {
      const {
        input: { email, password },
      } = args;

      try {
        const user: any = await User.findOne({ email });

        const isValidPassword: boolean = bcrypt.compareSync(
          password,
          user.password,
        );
        if (isValidPassword) {
          const token = jwt.sign(
            { _id: user._id, email: user.email },
            JWT_SECRET as Algorithm,
            { expiresIn: '1d' },
          );
          ctx.res.cookie('x-access-token', JSON.stringify(token), cookieOpts);
        }
        return {
          isAuthenticated: isValidPassword,
        };
      } catch (error: any) {
        throw new Error(error.message);
      }
    },
    signOutUser: async (_: any, _args: any, ctx: any): Promise<object> => {
      const token: string = ctx.req.cookies['x-access-token'];
      if (token) {
        const newToken = new Token();
        newToken.tags.push(token);
        await newToken.save();
      }
      ctx.res.clearCookie('x-access-token');
      return {
        status: 200,
      };
    },
    verifyRegistration: async (
      _: any,
      args: any,
      ctx: any,
    ): Promise<object> => {
      const {
        input: { options },
      } = args;
      console.log(args, 210);
      console.log(options, 211);

      const verification = await verifyRegistrationResponse(options);
      console.log(verification, 214);

      return { options: verification };
    },
    chat: async (_: any, args: any): Promise<any> => {
      const {
        input: { question },
      } = args;

      if (question) {
        const answer = await openai.chat.completions
          .create({
            model: 'gpt-3.5-turbo',
            messages: [{ role: 'user', content: question }],
            // temperature: 0,
            // max_tokens: 1000,
          })
          .then((res) => {
            return res.choices[0].message.content;
          })
          .catch((err) => {
            throw new Error(err);
          });
        console.log(answer, 160);
        await Chat.create({
          question,
          answer,
        });
        return {
          answer: answer,
        };
      }
    },
  },
};

export default resolvers;
