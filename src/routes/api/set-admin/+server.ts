import { json, type RequestHandler } from "@sveltejs/kit";

import admin from "$lib/firebase/admin";
import { ADMIN_EMAIL } from "$env/static/private";


const admin_email = ADMIN_EMAIL;

interface UserRecord {
    uid: string;
}

interface CustomClaims {
    admin: boolean;
}


export const POST: RequestHandler = async () => {
  const { email } = { email: admin_email } ;

  if (!email) {
    return json({ error: 'Email mancante.' }, { status: 400 });
  }

  try {
    const user = await admin.auth().getUserByEmail(email);
    await admin.auth().setCustomUserClaims(user.uid, { admin: true } as CustomClaims);
    return json({ success: true, message: `${email} è ora un amministratore.` });
  } catch (error) {
    console.error("Errore nell'impostare il claim admin:", error);
    return json({ error: "Errore nell'impostare il claim admin." }, { status: 500 });
  }
}


export async function _makeUserStaff(email: string): Promise<void> {
    try {
        const user = await admin.auth().getUserByEmail(email);

        await admin.auth().setCustomUserClaims(user.uid, { staff: true });

    } catch (error) {
        console.error(`❌ Errore nell'impostare lo staff per ${email}:`, error);
    }
}


