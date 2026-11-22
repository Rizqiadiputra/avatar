"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  SessionInteractivityMode,
  VoiceChatConfig,
} from "@heygen/liveavatar-web-sdk";
import { ClassroomSession, SessionResult } from "./ClassroomSession";
import { Onboarding } from "./Onboarding";
import { ClassSummaryPage, LearningDashboard } from "./LearningPages";
import {
  ClassSettings,
  loadClassSettings,
  requestFullSessionToken,
  saveClassSettings,
} from "../liveavatar/classSettings";
import {
  CLASSES,
  LearnerProfile,
  isCompleteProfile,
  labelOf,
  loadLearnerProfile,
} from "../liveavatar/learnerProfile";
import { findTutor } from "../liveavatar/tutors";
import {
  ClassRecord,
  loadClassHistory,
  saveClassRecord,
} from "../liveavatar/classHistory";

type View =
  | { name: "loading" }
  | { name: "dashboard" }
  | { name: "setup" }
  | { name: "class" }
  | { name: "summary"; recordId: string };

/**
 * Halaman kelas:
 * - Kunjungan pertama: layar masuk (bahasa → jalur → setup) lalu kelas.
 * - Setelah kelas: ringkasan kelas, lalu dashboard riwayat belajar.
 * - Kunjungan berikutnya (sudah punya riwayat): langsung ke dashboard.
 * Kecepatan suara dan push-to-talk diatur di "Opsi lainnya" halaman setup.
 * Butuh satu klik "Mulai Kelas" karena browser hanya mengizinkan suara avatar
 * diputar setelah ada interaksi.
 */
export const ClassroomPage = () => {
  const [settings, setSettings] = useState<ClassSettings | null>(null);
  const [profile, setProfile] = useState<LearnerProfile | null>(null);
  const [history, setHistory] = useState<ClassRecord[]>([]);
  const [view, setView] = useState<View>({ name: "loading" });
  const [sessionToken, setSessionToken] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // Setelah keluar dari kelas yang gagal/tak tersambung, kembali ke setup.
  const [returnedFromClass, setReturnedFromClass] = useState(false);

  useEffect(() => {
    setSettings(loadClassSettings());
    const saved = loadLearnerProfile();
    const past = loadClassHistory();
    if (isCompleteProfile(saved)) setProfile(saved as LearnerProfile);
    setHistory(past);
    setView(past.length > 0 ? { name: "dashboard" } : { name: "setup" });
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
      setView({ name: "class" });
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const onSessionStopped = useCallback(
    (result: SessionResult) => {
      setSessionToken("");
      // Sesi yang tidak pernah tersambung tidak dicatat; kembali ke setup.
      if (!profile || result.startedAt === null) {
        setReturnedFromClass(true);
        setView({ name: "setup" });
        return;
      }
      const record: ClassRecord = {
        id: `${result.startedAt}`,
        startedAt: result.startedAt,
        endedAt: result.endedAt,
        language: profile.language,
        track: profile.track,
        classKey: profile.classKey,
        tutorKey: profile.tutorKey,
        learnerName: profile.name,
        endReason: result.endReason,
        messages: result.messages,
      };
      setHistory(saveClassRecord(record));
      setView({ name: "summary", recordId: record.id });
    },
    [profile],
  );

  if (view.name === "loading") return null;

  if (view.name === "class" && sessionToken && settings && profile) {
    return (
      <ClassroomSession
        pushToTalk={settings.pushToTalk}
        language={profile.language}
        tutor={findTutor(profile.tutorKey)}
        courseTitle={labelOf(CLASSES, profile.classKey, profile.language)}
        sessionAccessToken={sessionToken}
        voiceChatConfig={voiceChatConfig}
        onSessionStopped={onSessionStopped}
      />
    );
  }

  if (view.name === "summary") {
    const record = history.find((r) => r.id === view.recordId);
    if (record)
      return (
        <ClassSummaryPage
          record={record}
          onHistory={() => setView({ name: "dashboard" })}
          onRetake={() => setView({ name: "setup" })}
        />
      );
  }

  if (view.name === "dashboard") {
    const saved = profile ?? loadLearnerProfile();
    return (
      <LearningDashboard
        history={history}
        learnerName={saved.name}
        language={saved.language ?? history[0]?.language ?? "id"}
        onOpen={(r) => setView({ name: "summary", recordId: r.id })}
        onNewClass={() => setView({ name: "setup" })}
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
      resumeSetup={returnedFromClass}
      onOpenHistory={
        history.length > 0 ? () => setView({ name: "dashboard" }) : undefined
      }
    />
  );
};
