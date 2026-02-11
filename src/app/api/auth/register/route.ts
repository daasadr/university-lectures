import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { z } from 'zod';

const registerSchema = z.object({
  name: z.string().min(2, 'Jméno musí mít alespoň 2 znaky'),
  email: z.string().email('Neplatný email'),
  password: z.string()
    .min(8, 'Heslo musí mít alespoň 8 znaků')
    .regex(/[A-Z]/, 'Heslo musí obsahovat alespoň jedno velké písmeno')
    .regex(/[a-z]/, 'Heslo musí obsahovat alespoň jedno malé písmeno')
    .regex(/[0-9]/, 'Heslo musí obsahovat alespoň jednu číslici')
    .regex(/[^A-Za-z0-9]/, 'Heslo musí obsahovat alespoň jeden speciální znak'),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Validace
    const validatedData = registerSchema.parse(body);
    
    // Kontrola jestli už existuje
    const existingUser = await prisma.user.findUnique({
      where: { email: validatedData.email }
    });
    
    if (existingUser) {
      return NextResponse.json(
        { error: 'Uživatel s tímto emailem už existuje' },
        { status: 400 }
      );
    }
    
    // Hash hesla
    const hashedPassword = await bcrypt.hash(validatedData.password, 10);
    
    // Vytvoř uživatele
    const user = await prisma.user.create({
      data: {
        name: validatedData.name,
        email: validatedData.email,
        password: hashedPassword,
      },
      select: {
        id: true,
        name: true,
        email: true,
      }
    });
    
    return NextResponse.json(
      { user, message: 'Registrace úspěšná!' },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.issues[0].message },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: 'Něco se pokazilo' },
      { status: 500 }
    );
  }
}