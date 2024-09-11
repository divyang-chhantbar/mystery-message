import dbConnect from '@/lib/dbConnect';
import UserModel from '@/model/User.model';
import mongoose from 'mongoose';
import { User } from 'next-auth';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]/option';

export async function GET(request: Request) {
  await dbConnect();
  const session = await getServerSession(authOptions);
  const _user: User = session?.user;

  if (!session || !_user) {
    return Response.json(
      { success: false, message: 'Not authenticated' },
      { status: 401 }
    );
  }
  const userId = new mongoose.Types.ObjectId(_user._id);
    console.log("Session:", session);
    console.log("User ID:", _user?._id);
    const user = await UserModel.findOne({ _id: userId });
    console.log("User document:", user);

  try {
    const user = await UserModel.aggregate([
      { $match: { _id: userId } },
      { $unwind: '$message' },
      { $sort: { 'message.createdAt': -1 } },
      { $group: { _id: '$_id', messages: { $push: '$message' } } },
    ]).exec();

    if (!user || user.length === 0) {
      return Response.json(
        { message: 'User not found', success: false },
        { status: 404 }
      );
    }

    return Response.json(
      { messages: user[0].messages },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error('An unexpected error occurred:', error);
    return Response.json(
      { message: 'Internal server error', success: false },
      { status: 500 }
    );
  }
}