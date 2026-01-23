import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db/mongodb';
import Project from '@/lib/models/Project';

export async function GET() {
  try {
    await dbConnect();
    const projects = await Project.find().sort({ createdAt: -1 });
    return NextResponse.json(projects);
  } catch (err: any) {
    return NextResponse.json({ error: 'Error al obtener proyectos' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await dbConnect();
    const data = await req.json();
    if (!data.name || !data.type) {
      return NextResponse.json({ error: 'Faltan campos obligatorios: nombre y tipo' }, { status: 400 });
    }
    const project = await Project.create(data);
    return NextResponse.json(project, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: 'Error al crear proyecto' }, { status: 500 });
  }
}
