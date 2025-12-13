import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db/mongodb';
import Expense from '@/lib/models/Expense';

export async function GET(request: NextRequest) {
  try {
    await dbConnect();

    const expenses = await Expense.find({}).sort({ date: -1 });

    return NextResponse.json({ success: true, data: expenses });
  } catch (error) {
    console.error('Error fetching expenses:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch expenses' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await dbConnect();

    const body = await request.json();

    const expense = new Expense(body);
    await expense.save();

    return NextResponse.json({ success: true, data: expense }, { status: 201 });
  } catch (error) {
    console.error('Error creating expense:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create expense' },
      { status: 500 }
    );
  }
}
