"use client";

import { useEffect, useMemo, useState } from "react";
import {
  SessionInteractivityMode,
  VoiceChatConfig,
} from "@heygen/liveavatar-web-sdk";
import { ClassroomSession } from "./ClassroomSession";
import { Onboarding } from "./Onboarding";
import {
  ClassSettings,
  loadClassSettings,
  requestFullSessionToken,
  saveClassSettings,
} from "../liveavatar/classSettings";
import { CLASSES, LearnerProfile, labelOf } from "../liveavatar/learnerProfile";
import { findTutor } from "../liveavatar/tutors";

/**
 * Halaman kelas: layar masuk (bahasa pengantar → jalur → halaman setup),
 * lalu kelas Full Mode. Bahasa diambil dari profil; kecepatan suara dan
 * push-to-talk diatur di "Opsi lainnya" (disimpan sama seperti /settings).
 * Butuh satu klik "Mulai Kelas" karena browser hanya mengizinkan suara avatar
 * diputar setelah ada interaksi.
 */
export const ClassroomPage = () => {
  const [settings, setSettings] = useState<ClassSettings | null>(null);
  const [profile, setProfile] = useState<LearnerProfile | null>(null);
  const [sessionToken, setSessionToken] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setSettings(loadClassSettings());
  }, []);

  const voiceChatConfig = useMemo<VoiceChatConfig>(
    () =>
      settings?.pushToTalk
        ? { mode: SessionInteractivityMode.PUSH_TO_TALK }
        : {},
    [settings?.pushToTalk],
  );

  const startClass = async (learner: LearnerProfile) => {
    if (!settings) return;
    setLoading(true);
    setError(null);
    try {
      const tutor = findTutor(learner.tutorKey);
      const token = await requestFullSessionToken({
        ...settings,
        language: learner.language,
        avatarId: tutor?.avatarId,
        voiceId: tutor?.voiceId,
      });
      setProfile(learner);
      setSessionToken(token);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  };

  if (sessionToken && settings && profile) {
    return (
      <ClassroomSession
        pushToTalk={settings.pushToTalk}
        language={profile.language}
        tutor={findTutor(profile.tutorKey)}
        courseTitle={labelOf(CLASSES, profile.classKey, profile.language)}
        sessionAccessToken={sessionToken}
        voiceChatConfig={voiceChatConfig}
        onSessionStopped={() => setSessionToken("")}
      />
    );
  }

  return (
    <Onboarding
      onStart={startClass}
      loading={loading || !settings}
      error={error}
      settings={settings}
      onSettingsChange={(next) => {
        setSettings(next);
        saveClassSettings(next);
      }}
    />
  );
};
