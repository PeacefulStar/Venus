import type {Request, Response} from "express";
import type { Algorithm } from 'jsonwebtoken';
import jwt from 'jsonwebtoken';
// import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
// import OpenAI from 'openai';
import { GoogleGenerativeAI } from "@google/generative-ai";
import {
  generateRegistrationOptions,
  verifyRegistrationResponse,
  // generateAuthenticationOptions,
  // verifyAuthenticationResponse,
} from '@simplewebauthn/server';

import type {
  GenerateRegistrationOptionsOpts,
  VerifyRegistrationResponseOpts,
  VerifiedRegistrationResponse,
  // GenerateAuthenticationOptionsOpts,
  // VerifyAuthenticationResponseOpts,
  // VerifiedAuthenticationResponse,
} from '@simplewebauthn/server';

// import type {
//   AuthenticationResponseJSON,
//   AuthenticatorDevice,
//   RegistrationResponseJSON,
// } from '@simplewebauthn/types';

import User from '../models/user';
import Token from '../models/token';
import Chat from '../models/chat';

interface env {
  JWT_SECRET: string;
  NODE_ENV: string;
  OPENAI_API_KEY: string;
  GOOGLE_GEN_AI_KEY: string;
}

dotenv.config({ path: '../../.env' });
const { JWT_SECRET, NODE_ENV, GOOGLE_GEN_AI_KEY } = process.env as unknown as env;;

const genAI = new GoogleGenerativeAI(GOOGLE_GEN_AI_KEY);

// const openai = new OpenAI({
//   apiKey: OPENAI_API_KEY,
// });

const cookieOpts = {
  path: '/',
  httpOnly: true,
  secure: NODE_ENV === 'production',
};

const isValidToken = (str: string): boolean => {
  if (str) {
    try {
      const token = JSON.parse(str) as string;
      return !!jwt.verify(token, JWT_SECRET as Algorithm);
    } catch (err) {
      console.log(err)
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
    async getUser(_: unknown, args: { email: string }): Promise<object> {
      const {email} = args;

      return await User.findOne({ email }) as object;
    },
    async isAuthenticated(
      _: never,
      _args: never,
      ctx: {req: { cookies: { 'x-access-token': string} },
        res: { clearCookie(xAccessToken: string): void}
      }): Promise<object> {
      const token = ctx.req.cookies['x-access-token'];
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
    generateRegistration: async (
      _: never,
      args: { email: string, name: string },
      ctx: {
        req: Request,
        res: Response
      }): Promise<object> => {

      const {name, email } = args;

      const opts: GenerateRegistrationOptionsOpts = {
        rpName: name,
        rpID: ctx.req.hostname,
        // userID: result.id,
        userName: email,
        // userDisplayName: user.displayName,
        timeout: 300000,
        attestationType: 'none',
        // excludeCredentials,
        authenticatorSelection: {
          residentKey: 'discouraged',
          userVerification: 'preferred'
        },
        supportedAlgorithmIDs: [-7, -257],
        // extensions,
      }

      const options = await generateRegistrationOptions(opts);
      const url = ctx.req.protocol + '://' + ctx.req.get('host');
      const user = await User.create({
        name,
        email,
        // password: bcrypt.hashSync(password, salt),
      });

      const token = jwt.sign(
        { id: user.id as string, email: user.email },
        JWT_SECRET as Algorithm,
        { expiresIn: '1d' },
      );
      ctx.res.cookie('x-access-token', JSON.stringify(token), cookieOpts);
      return { options: options, url: url }
    },
    // signInUser: async (_: never, args: { input: { email: string, password: string } }, ctx: any): Promise<object> => {
    //   const {
    //     input: { email, password },
    //   } = args;
    //
    //   try {
    //     const user: any = await User.findOne({ email });
    //
    //     const isValidPassword: boolean = bcrypt.compareSync(
    //       password,
    //       user.password,
    //     );
    //     if (isValidPassword) {
    //       const token = jwt.sign(
    //         { _id: user._id, email: user.email },
    //         JWT_SECRET as Algorithm,
    //         { expiresIn: '1d' },
    //       );
    //       ctx.res.cookie('x-access-token', JSON.stringify(token), cookieOpts);
    //     }
    //     return {
    //       isAuthenticated: isValidPassword,
    //     };
    //   } catch (error: any) {
    //     throw new Error(error.message);
    //   }
    // },
    // signOutUser: async (_: never, _args: never, ctx: any): Promise<object> => {
    //   const token = ctx.req.cookies['x-access-token'] as string;
    //   if (token) {
    //     const newToken = new Token();
    //     newToken.tags.push(token);
    //     await newToken.save();
    //   }
    //   ctx.res.clearCookie('x-access-token');
    //   return {
    //     status: 200,
    //   };
    // },
    verifyRegistration: async (
      _: unknown,
      args: {options: VerifyRegistrationResponseOpts},
      // ctx: {req: Request, res: Response}
    ): Promise<object> => {

      const {options } = args;
      const verification: VerifiedRegistrationResponse = await verifyRegistrationResponse(options);

      return { verified: verification.verified };
    },
    chat: async (_: unknown, args: {question: string }): Promise<object> => {
      const {question } = args;

      const model = genAI.getGenerativeModel({model: "gemini-pro"});
      const answer = await model
        .generateContent(question)
        .then((res) => {
          return res.response.text();
        })
        .catch((err: string) => {
          throw new Error(err);
        });

      await Chat.create({
        question,
        answer,
      });
      return {
        answer: answer,
      };
    },
  },
};

export default resolvers;
