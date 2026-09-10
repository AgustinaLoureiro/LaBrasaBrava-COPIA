import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

function plantillaAceptado(nombre: string): string {
  return `
  <div style="font-family: 'Trebuchet MS', sans-serif; background:#F0DFC6; padding: 32px;">
    <div style="max-width: 480px; margin: 0 auto; background:#FBF3E7; border-radius:16px; overflow:hidden; border: 1px solid #F2A63B;">
      <div style="background:#3F8F5B; padding: 24px; text-align:center;">
        <h1 style="color:#F0DFC6; font-size:24px; margin:0;">¡Registro aprobado!</h1>
      </div>
      <div style="padding: 24px;">
        <p style="color:#2E2A28; font-size:18px;">Hola <strong>${nombre}</strong>,</p>
        <p style="color:#2E2A28; font-size:16px; line-height:1.5;">
          Tu registro en <strong>Brasa Brava</strong> fue aprobado. Ya podés ingresar a la
          aplicación y disfrutar de la experiencia completa.
        </p>
        <p style="color:#2E2A28; font-size:16px;">¡Te esperamos!</p>
      </div>
      <div style="background:#6B2A13; padding:16px; text-align:center;">
        <span style="color:#F0DFC6; font-size:14px; font-weight:bold;">BRASA BRAVA</span>
      </div>
    </div>
  </div>`;
}

function plantillaRechazado(nombre: string): string {
  return `
  <div style="font-family: 'Trebuchet MS', sans-serif; background:#F0DFC6; padding: 32px;">
    <div style="max-width: 480px; margin: 0 auto; background:#FBF3E7; border-radius:16px; overflow:hidden; border: 1px solid #C2352A;">
      <div style="background:#C2352A; padding: 24px; text-align:center;">
        <h1 style="color:#F0DFC6; font-size:22px; margin:0;">Registro no aprobado</h1>
      </div>
      <div style="padding: 24px;">
        <p style="color:#2E2A28; font-size:18px;">Hola <strong>${nombre}</strong>,</p>
        <p style="color:#2E2A28; font-size:16px; line-height:1.5;">
          Tu registro en <strong>Brasa Brava</strong> no pudo ser aprobado en esta oportunidad.
          Si creés que fue un error, podés contactarte con el restaurante.
        </p>
      </div>
      <div style="background:#6B2A13; padding:16px; text-align:center;">
        <span style="color:#F0DFC6; font-size:14px; font-weight:bold;">BRASA BRAVA</span>
      </div>
    </div>
  </div>`;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { email, nombre, estado } = await req.json();

    if (!email || !nombre || !estado) {
      return new Response(JSON.stringify({ error: "Faltan datos" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const asunto = estado === "aceptado"
      ? "¡Tu registro en Brasa Brava fue aprobado!"
      : "Novedades sobre tu registro en Brasa Brava";

    const html = estado === "aceptado"
      ? plantillaAceptado(nombre)
      : plantillaRechazado(nombre);

    const respuesta = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "Brasa Brava <onboarding@resend.dev>",
        to: [email],
        subject: asunto,
        html,
      }),
    });

    const resultado = await respuesta.json();

    return new Response(JSON.stringify(resultado), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: String(error) }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});