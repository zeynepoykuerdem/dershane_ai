"use client";
import ProfileCard from "@/components/account/profile-card";

import PasswordCard from "@/components/account/password-card";

import { useState, useEffect } from "react";

import { supabase } from "@/lib/supabase/client";

interface ProfileForm {
  fullName: string;
  emailAddress: string;
  grade: string;
  role: string;
}

export default function AccountPage() {
  const [profileData, setProfileData] = useState<ProfileForm>({
    fullName: "",
    emailAddress: "",
    grade: "",
    role: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [savingProfile, setSavingProfile] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      const { data: profile } = await supabase
        .from("profiles")
        .select("full_name,role,grade")
        .eq("id", user?.id)
        .single();

      if (profile) {
        setProfileData({
          fullName: profile.full_name ?? "",
          emailAddress: user?.email ?? "",
          grade: profile.grade ?? "",
          role: profile.role ?? "",
        });
      }
    };
    fetchProfile();
  }, []);

  const handleProfileSave = async () => {
    setSavingProfile(true);
    const {
      data: { user },
    } = await supabase.auth.getUser();
    const { error } = await supabase
      .from("profiles")
      .update({ full_name: profileData.fullName, grade: profileData.grade })
      .eq("id", user?.id);

    if (error) {
      setError("Profil güncellenemedi");
      console.error("Profil güncellenemedi", error);
    }
    alert("Profil Güncellendi!");

    setSavingProfile(false);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
      <ProfileCard
        profileData={profileData}
        setProfileData={setProfileData}
        savingProfile={savingProfile}
        onSave={handleProfileSave}
      />
      <PasswordCard />
    </div>
  );
}
