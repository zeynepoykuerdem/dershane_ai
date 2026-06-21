"use client";
import { useState } from "react";
import { supabase } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface PasswordForm {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export default function PasswordCard() {
  const [savingPassword, setSavingPassword] = useState(false); // password kaydet butonu

  const [checkPassword, setCheckPassword] = useState(false);
  const [error, setError] = useState<string | null>(null); // field altinda kirmizi mesaj
  const [success, setSuccess] = useState(false); // yesil toast bildirimi
  const [editPassword, setEditPassword] = useState(false); // yeni password

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [PasswordData, setPasswordData] = useState<PasswordForm>({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const resetPasswordForm = () => {
    setPasswordData({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
    setEditPassword(false);
  };

  const currentPaswordCheck = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    const { error } = await supabase.auth.signInWithPassword({
      email: user?.email ?? "",
      password: PasswordData.currentPassword,
    });
    if (error) {
      setError("Sifre sistemdekinden farkli");
      setCheckPassword(false);
      return;
    }
    setCheckPassword(true);
    setError(null);
  };
  const newPasswordUpdate = async () => {
    if (PasswordData.newPassword !== PasswordData.confirmPassword) {
      setError("Sifreler uyusmuyor");
      return;
    }
    setSavingPassword(true);
    setError(null);

    try {
      const { error } = await supabase.auth.updateUser({
        password: PasswordData.newPassword,
      });
      if (error) {
        setError(error.message);
      } else {
        setSuccess(true);
        resetPasswordForm();
      }
    } finally {
      setSavingPassword(false);
    }
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle> Mevcut Şifre Değiştir </CardTitle>
        <CardDescription>Hesabınızın şifresini güncelleyin.</CardDescription>
      </CardHeader>
      <CardContent className=" flex flex-col gap-6">
        {!editPassword ? (
          <Button variant="outline" onClick={() => setEditPassword(true)}>
            Şifre Değiştir
          </Button>
        ) : (
          <>
            <div className="flex flex-col gap-2">
              <Label htmlFor="current">Mevcut şifre</Label>
              <div className="relative">
                <Input
                  id="current"
                  type={"password"}
                  value={PasswordData.currentPassword ?? ""}
                  disabled
                  className="pr-10"
                  placeholder="******"
                />
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="next">Yeni şifre</Label>
              <div className="relative">
                <Input
                  id="next"
                  type={showNewPassword ? "text" : "password"}
                  value={PasswordData.newPassword}
                  onChange={(e) =>
                    setPasswordData({
                      ...PasswordData,
                      newPassword: e.target.value,
                    })
                  }
                  placeholder="Yeni şifrenizi girin"
                  className="pr-10"
                />
                <button
                  type="button"
                  id="newP"
                  onClick={() => setShowNewPassword((prev) => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showNewPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="confirm">Şifre Tekrar</Label>
              <div className="relative">
                <Input
                  id="confirm"
                  type={showConfirmPassword ? "text" : "password"}
                  value={PasswordData.confirmPassword}
                  onChange={(e) =>
                    setPasswordData({
                      ...PasswordData,
                      confirmPassword: e.target.value,
                    })
                  }
                  placeholder="Şifrenizi tekrar girin"
                  className="pr-10"
                />
                <button
                  type="button"
                  id="confirmP"
                  onClick={() => setShowConfirmPassword((prev) => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showConfirmPassword ? (
                    <EyeOff size={16} />
                  ) : (
                    <Eye size={16} />
                  )}
                </button>
              </div>
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            {success && (
              <p className="text-green-500 text-sm">Şifre güncellendi!</p>
            )}
          </>
        )}
      </CardContent>
      {editPassword && (
        <CardFooter className="justify-end gap-2 pt-6">
          <Button variant="ghost" onClick={resetPasswordForm}>
            Iptal
          </Button>
          <Button onClick={newPasswordUpdate} disabled={savingPassword}>
            {savingPassword ? "Kaydediliyor..." : "Kaydet"}
          </Button>
          <Button variant="ghost">Sifremi Unuttum</Button>
        </CardFooter>
      )}
    </Card>
  );
}
