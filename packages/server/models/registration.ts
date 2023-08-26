import { Schema, model } from 'mongoose';

interface IRegistration {
  mail: string;
}

const registrationSchema = new Schema<IRegistration>(
  {
    mail: {
      type: String,
      min: 6,
      max: 255,
      unique: true,
      required: true,
    },
  },
  { timestamps: true },
);

const Registration = model<IRegistration>('registration', registrationSchema);

export default Registration;
