"use client";

import {
  Attachment,
  AttachmentInfo,
  AttachmentPreview,
  AttachmentRemove,
  Attachments,
} from "@/components/ai-elements/attachments";
import {
  Conversation,
  ConversationContent,
  ConversationScrollButton,
} from "@/components/ai-elements/conversation";
import {
  Message,
  MessageContent,
  MessageResponse,
} from "@/components/ai-elements/message";
import {
  PromptInput,
  PromptInputBody,
  PromptInputButton,
  PromptInputFooter,
  PromptInputSubmit,
  PromptInputTextarea,
  PromptInputTools,
  type PromptInputMessage,
  usePromptInputAttachments,
} from "@/components/ai-elements/prompt-input";
import { AccountMenu } from "@/components/account-menu";
import { Button } from "@/components/ui/button";
import type { ChatStatus } from "ai";
import type { Viewer } from "@/lib/auth-context";
import Image from "next/image";
import Link from "next/link";
import {
  CheckCircle2,
  ExternalLink,
  Eye,
  Laptop,
  Loader2,
  Paperclip,
  Plus,
  RefreshCw,
  ShieldCheck,
  Smartphone,
  Sparkles,
  Tablet,
} from "lucide-react";
import { useCallback, useState } from "react";

export type DashboardSite = {
  id: string;
  name: string;
  url: string;
  organizationId: string;
};

type ChatMessage = {
  id: number;
  from: "user" | "assistant";
  text: string;
  draftReady?: boolean;
};

type CodexStreamPayload =
  | { type: "status"; label: string }
  | { type: "progress"; changes: number }
  | { type: "message"; text: string }
  | { type: "draft"; title: string; url: string; number: number | null }
  | { type: "usage" }
  | { type: "done" }
  | { type: "error"; message: string };

const suggestions = [
  "Update our business hours",
  "Make the order button easier to find",
  "Add a catering section",
];

const deviceOptions = [
  { icon: Laptop, name: "desktop" },
  { icon: Tablet, name: "tablet" },
  { icon: Smartphone, name: "mobile" },
] as const;

function SnoballMark() {
  return (
    <div className="flex items-center gap-2.5" aria-label="Snoball Media">
      <Image alt="" className="size-8" height={32} priority src="/snoball-logo.svg" width={32} />
      <span className="custom-font mt-1 hidden text-[15px] font-medium tracking-[-0.02em] text-primary sm:block">
        snoball <span className="text-foreground">media</span>
      </span>
    </div>
  );
}

function ComposerAttachments() {
  const attachments = usePromptInputAttachments();
  if (attachments.files.length === 0) return null;

  return (
    <Attachments className="px-3 pt-3" variant="inline">
      {attachments.files.map((file) => (
        <Attachment data={file} key={file.id} onRemove={() => attachments.remove(file.id)}>
          <AttachmentPreview />
          <AttachmentInfo />
          <AttachmentRemove />
        </Attachment>
      ))}
    </Attachments>
  );
}

function ComposerAttachButton() {
  const attachments = usePromptInputAttachments();
  return (
    <PromptInputButton aria-label="Attach a photo" onClick={() => attachments.openFileDialog()} tooltip="Attach a photo">
      <Paperclip className="size-4" />
    </PromptInputButton>
  );
}

function MobileTabs({
  active,
  onChange,
}: {
  active: "preview" | "assistant";
  onChange: (panel: "preview" | "assistant") => void;
}) {
  return (
    <nav className="grid h-12 shrink-0 grid-cols-2 border-t bg-background lg:hidden" aria-label="Dashboard view">
      <button
        className={`flex items-center justify-center gap-2 text-xs font-medium ${active === "preview" ? "text-primary" : "text-muted-foreground"}`}
        onClick={() => onChange("preview")}
        type="button"
      >
        <Eye className="size-4" /> Website
      </button>
      <button
        className={`flex items-center justify-center gap-2 border-l text-xs font-medium ${active === "assistant" ? "text-primary" : "text-muted-foreground"}`}
        onClick={() => onChange("assistant")}
        type="button"
      >
        <Sparkles className="size-4" /> Assistant
      </button>
    </nav>
  );
}

export function SnoballWorkspace({
  authEnabled,
  site,
  sites,
  viewer,
}: {
  authEnabled: boolean;
  site: DashboardSite;
  sites: DashboardSite[];
  viewer: Viewer;
}) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 1,
      from: "assistant",
      text: `I’m connected to **${site.name}**. Tell me what you’d like to change and I’ll prepare a private draft for review. Nothing goes live until it’s approved.`,
    },
  ]);
  const [status, setStatus] = useState<ChatStatus>("ready");
  const [agentStatus, setAgentStatus] = useState(`Ready for ${site.name}`);
  const [device, setDevice] = useState<"desktop" | "tablet" | "mobile">("desktop");
  const [mobilePanel, setMobilePanel] = useState<"preview" | "assistant">("preview");
  const [previewKey, setPreviewKey] = useState(0);

  const submitPrompt = useCallback(
    async (message: PromptInputMessage) => {
      if (!message.text.trim() && message.files.length === 0) return;

      const requestText = message.text.trim() || "Use the attached photo for this update.";
      const userId = Date.now();
      const assistantId = userId + 1;
      let assistantText = "";
      let draftReady = false;

      const upsertAssistant = () => {
        const nextMessage: ChatMessage = {
          id: assistantId,
          from: "assistant",
          text: assistantText || "I’m preparing that update now…",
          draftReady,
        };
        setMessages((current) => {
          const exists = current.some((item) => item.id === assistantId);
          return exists
            ? current.map((item) => (item.id === assistantId ? nextMessage : item))
            : [...current, nextMessage];
        });
      };

      setMessages((current) => [
        ...current,
        { id: userId, from: "user", text: requestText },
      ]);
      setStatus("submitted");
      setAgentStatus(`Opening ${site.name}`);

      try {
        const response = await fetch("/api/codex", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            prompt: requestText,
            organizationId: site.organizationId,
            files: message.files.map((file) => ({
              filename: file.filename,
              mediaType: file.mediaType,
              url: file.url,
            })),
          }),
        });

        if (!response.ok) {
          const body = (await response.json().catch(() => null)) as { error?: string } | null;
          throw new Error(body?.error || "The assistant could not start this update.");
        }
        if (!response.body) throw new Error("The assistant returned an empty response.");

        setStatus("streaming");
        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let buffer = "";

        while (true) {
          const { done, value } = await reader.read();
          buffer += decoder.decode(value, { stream: !done });
          const lines = buffer.split("\n");
          buffer = lines.pop() ?? "";

          for (const line of lines) {
            if (!line.trim()) continue;
            const payload = JSON.parse(line) as CodexStreamPayload;
            if (payload.type === "status") {
              setAgentStatus(payload.label);
            } else if (payload.type === "progress") {
              setAgentStatus("Preparing your private draft");
            } else if (payload.type === "message") {
              assistantText = payload.text;
              upsertAssistant();
            } else if (payload.type === "draft") {
              draftReady = true;
              upsertAssistant();
            } else if (payload.type === "error") {
              throw new Error(payload.message);
            }
          }
          if (done) break;
        }

        if (!assistantText) {
          assistantText = draftReady
            ? "Your update is ready for review. Nothing has been published."
            : "I checked the website and no update was needed.";
          upsertAssistant();
        }
        setAgentStatus("Ready");
        setStatus("ready");
      } catch (error) {
        assistantText = `I couldn’t complete that update: ${
          error instanceof Error ? error.message : "Please try again."
        }`;
        upsertAssistant();
        setStatus("error");
      }
    },
    [site]
  );

  const handleSuggestion = useCallback(
    (text: string) => void submitPrompt({ files: [], text }),
    [submitPrompt]
  );

  const previewWidth =
    device === "mobile"
      ? "max-w-[390px]"
      : device === "tablet"
        ? "max-w-[820px]"
        : "max-w-none";

  return (
    <main className="workspace-enter flex h-[100dvh] max-h-[100dvh] flex-col overflow-hidden bg-background text-foreground">
      <header className="flex h-14 shrink-0 items-center gap-3 border-b bg-background/95 px-3 backdrop-blur sm:px-4">
        <SnoballMark />
        <span className="hidden h-5 w-px bg-border sm:block" />
        <label className="min-w-0 flex-1 sm:max-w-64">
          <span className="sr-only">Current website</span>
          <select
            className="h-9 w-full truncate rounded-md border-0 bg-transparent px-2 text-sm font-medium outline-none hover:bg-muted focus:bg-muted"
            onChange={(event) => {
              window.location.href = `/dashboard?organization=${encodeURIComponent(event.target.value)}`;
            }}
            value={site.organizationId}
          >
            {sites.map((candidate) => (
              <option key={candidate.organizationId} value={candidate.organizationId}>
                {candidate.name}
              </option>
            ))}
          </select>
        </label>
        <div className="ml-auto flex items-center gap-1.5">
          {viewer.isAdmin && !viewer.isDemo && (
            <Button asChild className="hidden h-8 gap-1.5 text-xs sm:flex" size="sm" variant="ghost">
              <Link href="/dashboard/onboarding"><Plus className="size-3.5" /> Add website</Link>
            </Button>
          )}
          <Button asChild className="h-8 gap-1.5 text-xs" size="sm" variant="ghost">
            <a href={site.url} rel="noreferrer" target="_blank">
              <ExternalLink className="size-3.5" /> <span className="hidden sm:inline">Open live site</span>
            </a>
          </Button>
          <AccountMenu authEnabled={authEnabled} initials={viewer.initials} />
        </div>
      </header>

      <div className="grid min-h-0 flex-1 grid-cols-1 overflow-hidden lg:grid-cols-[minmax(0,1fr)_420px]">
        <section className={`${mobilePanel === "assistant" ? "hidden lg:flex" : "flex"} min-h-0 flex-col overflow-hidden bg-[#141414]`}>
          <div className="relative flex h-12 shrink-0 items-center justify-between border-b border-white/10 px-3 sm:px-4">
            <div>
              <p className="text-xs font-medium text-white">Live website</p>
              <p className="text-[10px] text-white/50">Your draft stays private until approval</p>
            </div>
            <div className="absolute left-1/2 hidden -translate-x-1/2 items-center rounded-lg border border-white/10 bg-white/5 p-0.5 sm:flex">
              {deviceOptions.map(({ name, icon: Icon }) => (
                <button
                  aria-label={`${name} preview`}
                  className={`grid size-7 place-items-center rounded-md transition ${device === name ? "bg-white text-black" : "text-white/55 hover:text-white"}`}
                  key={name}
                  onClick={() => setDevice(name)}
                  type="button"
                >
                  <Icon className="size-3.5" />
                </button>
              ))}
            </div>
            <Button aria-label="Refresh website preview" className="size-8 text-white/70 hover:bg-white/10 hover:text-white" onClick={() => setPreviewKey((value) => value + 1)} size="icon" variant="ghost">
              <RefreshCw className="size-3.5" />
            </Button>
          </div>

          <div className="flex min-h-0 flex-1 justify-center overflow-hidden p-0 sm:p-4">
            <div className={`h-full w-full ${previewWidth} overflow-hidden bg-white shadow-2xl transition-[max-width] duration-300 sm:rounded-xl sm:border sm:border-white/10`}>
              <iframe
                className="h-full w-full border-0 bg-white"
                key={previewKey}
                src={site.url}
                title={`${site.name} website preview`}
              />
            </div>
          </div>
          <MobileTabs active={mobilePanel} onChange={setMobilePanel} />
        </section>

        <aside className={`${mobilePanel === "preview" ? "hidden lg:flex" : "flex"} min-h-0 flex-col overflow-hidden border-l bg-background`}>
          <div className="flex h-12 shrink-0 items-center gap-3 border-b px-4">
            <span className="grid size-7 place-items-center rounded-lg bg-primary/12 text-primary">
              <Sparkles className="size-3.5" />
            </span>
            <div>
              <p className="text-xs font-semibold">Website assistant</p>
              <p className="flex items-center gap-1 text-[10px] text-muted-foreground">
                <ShieldCheck className="size-3" /> Changes stay private until approved
              </p>
            </div>
          </div>

          <Conversation className="min-h-0 flex-1">
            <ConversationContent className="gap-5 px-4 py-5">
              {messages.map((message) => (
                <Message from={message.from} key={message.id}>
                  <MessageContent>
                    <MessageResponse>{message.text}</MessageResponse>
                    {message.draftReady && (
                      <div className="mt-3 flex items-start gap-2 rounded-lg border border-emerald-500/20 bg-emerald-500/8 px-3 py-2.5 text-xs text-emerald-200">
                        <CheckCircle2 className="mt-0.5 size-4 shrink-0" />
                        <span><strong className="block font-medium">Private draft saved</strong>Snoball can review it with you before anything is published.</span>
                      </div>
                    )}
                  </MessageContent>
                </Message>
              ))}
              {(status === "submitted" || status === "streaming") && (
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Loader2 className="size-3.5 animate-spin text-primary" /> {agentStatus}
                </div>
              )}
            </ConversationContent>
            <ConversationScrollButton />
          </Conversation>

          <div className="shrink-0 border-t bg-background px-3 pb-3 pt-2.5">
            <div className="hide-scrollbar mb-2 flex gap-1.5 overflow-x-auto">
              {suggestions.map((suggestion) => (
                <button
                  className="shrink-0 rounded-full border bg-card/40 px-2.5 py-1.5 text-[10px] text-muted-foreground transition hover:border-primary/40 hover:text-foreground"
                  key={suggestion}
                  onClick={() => handleSuggestion(suggestion)}
                  type="button"
                >
                  {suggestion}
                </button>
              ))}
            </div>
            <PromptInput accept="image/*" className="[&_[data-slot=input-group]]:rounded-xl [&_[data-slot=input-group]]:bg-card/60 [&_[data-slot=input-group]]:shadow-none" maxFiles={4} multiple onSubmit={submitPrompt}>
              <ComposerAttachments />
              <PromptInputBody>
                <PromptInputTextarea placeholder={`What would you like to change on ${site.name}?`} />
              </PromptInputBody>
              <PromptInputFooter>
                <PromptInputTools>
                  <ComposerAttachButton />
                </PromptInputTools>
                <PromptInputSubmit disabled={status === "submitted" || status === "streaming"} status={status} />
              </PromptInputFooter>
            </PromptInput>
            <p className="mt-2 px-1 text-[9px] text-muted-foreground/70">Attach a photo or describe the update in your own words.</p>
          </div>
          <MobileTabs active={mobilePanel} onChange={setMobilePanel} />
        </aside>
      </div>
    </main>
  );
}
