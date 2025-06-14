// src/app.d.ts

// Questo importa le definizioni base di SvelteKit
import '@sveltejs/kit';

declare global {
	namespace App {
		interface Locals {
			email?: string;
		}
	}
}

export {}; // Necessario per renderlo un modulo
