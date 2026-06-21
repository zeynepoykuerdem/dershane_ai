"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

/**
 * 
 * @returns 
 * Ad soyad düzenleme
   Email görüntüleme (değiştirilemez)
   Şifre değiştirme
   Profil fotoğrafı
   Sinif değiştirme
   Rol bilgisi (sadece görüntüleme)
 * 
 * 
 * 
 */
interface ProfileForm {
  fullName: string;
  emailAddress: string;
  grade: string;
  role: string;
}
interface ProfileCardProps {
  profileData: ProfileForm;
  setProfileData: (data: ProfileForm) => void;
  savingProfile: boolean;
  onSave: () => void;
}

export default function ProfileCard({
  profileData,
  setProfileData,
  savingProfile,
  onSave,
}: ProfileCardProps) {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Profil Bilgileri</CardTitle>
        <CardDescription>
          Hesabınızın herkese açık bilgilerini güncelleyin.
        </CardDescription>
      </CardHeader>
      <CardContent className=" flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <Label htmlFor="fullName">Ad Soyad</Label>
          <Input
            id="fullName"
            value={profileData.fullName ?? ""}
            onChange={(e) =>
              setProfileData({ ...profileData, fullName: e.target.value })
            }
            className="bg-gray-50 text-gray-500"
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="email">E-mail</Label>
          <Input
            id="email"
            type="email"
            value={profileData.emailAddress ?? ""}
            disabled
            className="bg-gray-50 text-gray-500"
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="grade">Sınıf</Label>
          <Input
            id="grade"
            value={profileData.grade ?? ""}
            onChange={(e) =>
              setProfileData({ ...profileData, grade: e.target.value })
            }
            className="bg-gray-50 text-gray-500"
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="role">Rol</Label>
          <Input
            id="rol"
            value={profileData.role ?? ""}
            disabled
            className="bg-gray-50 text-gray-500"
          />
        </div>
      </CardContent>
      <CardFooter className="justify-end pt-6">
        <Button onClick={onSave} disabled={savingProfile}>
          {savingProfile ? "Kaydediliyor..." : "Değişiklikleri Kaydet"}
        </Button>
      </CardFooter>
    </Card>
  );
}
