import jwt, {Algorithm} from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import User from '..//models/user';
import Token from '../models/token';

dotenv.config({path: '../../../.env'});
const {JWT_SECRET} = process.env;

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
    async getUserByEmail(_: any, args: any): Promise<object> {
      const {
        input: {email},
      } = args;
      return User.findOne({email}) as any;
    },
    async isAuthenticated(_: any, _args: any, ctx: any): Promise<object> {
      const token: string = ctx.req.cookies['x-access-token'];
      const tokens: string[] = await Token.find({tags: token});
      const status: number = getStatus(
        ctx.req.cookies['x-access-token'],
        tokens
      );
      if (status === 401) {
        if (token) {
          const newToken = new Token();
          newToken.tags.push(token);
          newToken.save();
        }
        ctx.res.clearCookie(TOKEN_KEY);
      }
      return {
        status,
      };
    },
  },
  Mutation: {
    createUser: async (_: any, args: any, ctx: any): Promise<object> => {
      const {input: {name, email, password},} = args;
      const salt = bcrypt.genSaltSync(10);

      try {
        const user = await User.create({
          name,
          email,
          password: bcrypt.hashSync(password, salt),
        });

        const token = jwt.sign(
          {_id: user._id, email: user.email},
          JWT_SECRET as Algorithm,
          {expiresIn: '1d'}
        );

        ctx.res.cookie(TOKEN_KEY, JSON.stringify(token), cookieOpts);
        return {token};
      } catch (error: any) {
        console.log(error, 99)
        throw new Error(error.message);
      }
    },
    signInUser: async (_: any, args: any, ctx: any): Promise<object> => {
      const {
        input: {email, password},
      } = args;

      try {
        const user: any = await User.findOne({
          email,
        });

        const isValidPassword: boolean = bcrypt.compareSync(
          password,
          user.password
        );
        if (isValidPassword) {
          const token = jwt.sign(
            {_id: user._id, email: user.email},
            JWT_SECRET as Algorithm,
            {
              expiresIn: '1d',
            }
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
  },
};

export default resolvers;
