import jwt, { Algorithm } from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import { Configuration, OpenAIApi } from 'openai';
import User from '..//models/user';
import Token from '../models/token';
import Ai from '../models/ai';

dotenv.config({ path: '../../../.env' });
const { JWT_SECRET, OPENAI_API_KEY } = process.env;

const configuration = new Configuration({
  apiKey: OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

const TOKEN_KEY = 'x-access-token';
const cookieOpts = {
  path: '/',
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
};

const generateToken = (str: string): string | null => {
  if (str) {
    try {
      return JSON.parse(str);
    } catch (err) {
      return null;
    }
  }
  return null;
};

const isValidToken = (str: string): boolean => {
  if (str) {
    try {
      const token: any = generateToken(str);
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
    async isAuthenticated(_: any, _args: any, ctx: any): Promise<object> {
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
        ctx.res.clearCookie(TOKEN_KEY);
      }
      return { status };
    },
  },
  Mutation: {
    createUser: async (_: any, args: any, ctx: any): Promise<object> => {
      const {
        input: { name, email, password },
      } = args;
      const salt = bcrypt.genSaltSync(10);

      try {
        const user = await User.create({
          name,
          email,
          password: bcrypt.hashSync(password, salt),
        });

        const token = jwt.sign(
          { id: user.id, email: user.email },
          JWT_SECRET as Algorithm,
          { expiresIn: '1d' },
        );

        ctx.res.cookie(TOKEN_KEY, JSON.stringify(token), cookieOpts);
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
          ctx.res.cookie(TOKEN_KEY, JSON.stringify(token), cookieOpts);
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
      ctx.res.clearCookie(TOKEN_KEY);
      return {
        status: 200,
      };
    },
    chat: async (_: any, args: any): Promise<any> => {
      const {
        input: { question },
      } = args;

      if (question) {
        const answer = await openai
          .createCompletion({
            model: 'text-davinci-003',
            prompt: question,
            temperature: 0,
            max_tokens: 7,
          })
          .then((res) => {
            return res.data.choices[0].text;
          })
          .catch((err) => {
            throw new Error(err);
          });
        await Ai.create({
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
