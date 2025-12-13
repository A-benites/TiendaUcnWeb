"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { authService } from "@/services/auth.service";
import { AxiosError } from "axios";
import { Button } from "@/components/ui/button";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { Loader2, Mail, RefreshCw, Shield, ArrowRight, CheckCircle2, ArrowLeft } from "lucide-react";

function VerifyEmailContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email");

  const [verificationCode, setVerificationCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    if (!email) {
      toast.error("No se especificó un correo electrónico");
      router.push("/register");
    }
  }, [email, router]);

  // Cooldown para reenvío de código
  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => setResendCooldown((prev) => prev - 1), 1000);
      return () => clearTimeout(timer);
    }
    return undefined;
  }, [resendCooldown]);

  const handleVerify = async () => {
    if (verificationCode.length !== 6 || !email) return;

    setIsLoading(true);
    try {
      await authService.verifyEmail({
        email,
        verificationCode,
      });

      setIsSuccess(true);
      toast.success("¡Cuenta verificada exitosamente!");
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      const message = axiosError.response?.data?.message || "Código inválido o expirado";
      toast.error(message);
      setVerificationCode("");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    if (resendCooldown > 0 || !email) return;

    setIsLoading(true);
    try {
      await authService.resendVerificationCode(email);
      setResendCooldown(60);
      toast.success("Código reenviado exitosamente");
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      const message = axiosError.response?.data?.message || "Error al reenviar el código";
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  if (!email) return null;

  if (isSuccess) {
    return (
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader>
          <div className="mx-auto mb-2 flex h-16 w-16 animate-bounce items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
            <CheckCircle2 className="h-8 w-8 text-green-600 dark:text-green-400" />
          </div>
          <CardTitle className="text-center text-2xl">¡Cuenta verificada!</CardTitle>
          <CardDescription className="text-center">
            Ya puedes iniciar sesión con tu cuenta.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={() => router.push("/login")} className="w-full">
            Ir a iniciar sesión
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md shadow-lg">
      <CardHeader>
        <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
          <Mail className="h-6 w-6 text-primary" />
        </div>
        <CardTitle className="text-center text-2xl">Verifica tu correo</CardTitle>
        <CardDescription className="text-center">
          Ingresa el código de 6 dígitos enviado a{" "}
          <span className="font-medium text-foreground">{email}</span>
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex justify-center">
          <InputOTP
            maxLength={6}
            value={verificationCode}
            onChange={setVerificationCode}
            disabled={isLoading}
          >
            <InputOTPGroup>
              <InputOTPSlot index={0} />
              <InputOTPSlot index={1} />
              <InputOTPSlot index={2} />
            </InputOTPGroup>
            <InputOTPGroup>
              <InputOTPSlot index={3} />
              <InputOTPSlot index={4} />
              <InputOTPSlot index={5} />
            </InputOTPGroup>
          </InputOTP>
        </div>

        <Button
          onClick={handleVerify}
          className="w-full"
          disabled={isLoading || verificationCode.length !== 6}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Verificando...
            </>
          ) : (
            <>
              Verificar código
              <Shield className="ml-2 h-4 w-4" />
            </>
          )}
        </Button>

        <Button
          variant="ghost"
          onClick={handleResend}
          disabled={resendCooldown > 0 || isLoading}
          className="w-full"
        >
          <RefreshCw className="mr-2 h-4 w-4" />
          {resendCooldown > 0 ? `Reenviar en ${resendCooldown}s` : "Reenviar código"}
        </Button>
      </CardContent>
    </Card>
  );
}

export default function VerifyEmailPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4 dark:bg-black">
      <div className="w-full max-w-md">
        <Link
          href="/register"
          className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-4 transition-colors"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Volver al registro
        </Link>
        <Suspense fallback={<Loader2 className="h-8 w-8 animate-spin" />}>
          <VerifyEmailContent />
        </Suspense>
      </div>
    </div>
  );
}
