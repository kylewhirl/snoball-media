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
  PromptInputHeader,
  type PromptInputMessage,
  PromptInputSubmit,
  PromptInputTextarea,
  PromptInputTools,
  usePromptInputAttachments,
} from "@/components/ai-elements/prompt-input";
import { AccountMenu } from "@/components/account-menu";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type { ChatStatus } from "ai";
import type { Viewer } from "@/lib/auth-context";
import type { SiteContent } from "@/lib/site-types";
import Image from "next/image";
import {
  ArrowLeft,
  Bot,
  Check,
  ChevronDown,
  CircleHelp,
  Code2,
  ExternalLink,
  Eye,
  FileCode2,
  Gauge,
  Globe2,
  History,
  Laptop,
  LayoutDashboard,
  MoreHorizontal,
  MousePointer2,
  PanelRightClose,
  RefreshCw,
  Rocket,
  Settings,
  ShieldCheck,
  Smartphone,
  Sparkles,
  Tablet,
  Users,
  WandSparkles,
  X,
  Paperclip,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

type ChatMessage = {
  id: number;
  from: "user" | "assistant";
  text: string;
  changes?: { path: string; kind: "add" | "delete" | "update" }[];
  showChangeSet?: boolean;
};

const initialMessages: ChatMessage[] = [
  {
    id: 1,
    from: "assistant",
    text: "I’m connected to **Marigold Bakery** and ready to help. Ask for a content, design, or code change—I’ll make a draft for you to review before anything goes live.",
  },
  {
    id: 2,
    from: "user",
    text: "Make the homepage feel more inviting for Sunday brunch. Update the headline and add a preorder button.",
  },
  {
    id: 3,
    from: "assistant",
    showChangeSet: true,
    text: "Done. I updated the hero message and added a **Preorder for Sunday** action. I kept the bakery’s existing voice and color palette.",
  },
];

type CodexStreamPayload =
  | { type: "thread"; threadToken: string }
  | { type: "status"; label: string }
  | {
      type: "file_change";
      changes: { path: string; kind: "add" | "delete" | "update" }[];
    }
  | { type: "message"; text: string }
  | { type: "site_content"; content: SiteContent }
  | { type: "usage" }
  | { type: "done" }
  | { type: "error"; message: string };

const suggestions = [
  "Update our weekend hours",
  "Add this photo to the homepage",
  "Create a catering page",
];

const deviceOptions = [
  { icon: Laptop, name: "desktop" },
  { icon: Tablet, name: "tablet" },
  { icon: Smartphone, name: "mobile" },
] as const;

function SnoballMark({ compact = false }: { compact?: boolean }) {
  return (
    <div className="flex items-center gap-2.5" aria-label="Snoball Media">
      <Image
        alt=""
        className="size-8"
        height={32}
        priority
        src="/snoball-logo.svg"
        width={32}
      />
      {!compact && (
        <span className="custom-font mt-1 text-[15px] font-medium tracking-[-0.02em] text-primary">
          snoball <span className="text-foreground">media</span>
        </span>
      )}
    </div>
  );
}

function NavIcon({
  label,
  active,
  children,
}: {
  label: string;
  active?: boolean;
  children: React.ReactNode;
}) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          aria-label={label}
          className={`grid size-9 place-items-center rounded-lg transition-all duration-200 ${
            active
              ? "bg-sidebar-accent text-foreground shadow-[inset_3px_0_0_var(--primary)]"
              : "text-muted-foreground hover:bg-sidebar-accent/70 hover:text-foreground"
          }`}
          type="button"
        >
          {children}
        </button>
      </TooltipTrigger>
      <TooltipContent side="right">{label}</TooltipContent>
    </Tooltip>
  );
}

function ComposerAttachments() {
  const attachments = usePromptInputAttachments();

  if (attachments.files.length === 0) return null;

  return (
    <PromptInputHeader className="px-2 pt-2">
      <Attachments variant="inline">
        {attachments.files.map((file) => (
          <Attachment
            data={file}
            key={file.id}
            onRemove={() => attachments.remove(file.id)}
          >
            <AttachmentPreview />
            <AttachmentInfo />
            <AttachmentRemove />
          </Attachment>
        ))}
      </Attachments>
    </PromptInputHeader>
  );
}

function ComposerAttachButton() {
  const attachments = usePromptInputAttachments();

  return (
    <PromptInputButton
      aria-label="Add a reference"
      onClick={attachments.openFileDialog}
      tooltip="Add a reference"
    >
      <Paperclip className="size-3.5" />
    </PromptInputButton>
  );
}

function ChangeSet({
  changes,
}: {
  changes?: { path: string; kind: "add" | "delete" | "update" }[];
}) {
  const visibleChanges =
    changes && changes.length > 0
      ? changes.map((change) => [
          change.path,
          change.kind === "add"
            ? "Added"
            : change.kind === "delete"
              ? "Deleted"
              : "Updated",
        ])
      : [
          ["src/app/page.tsx", "+12 −4"],
          ["src/components/hero.tsx", "+18 −7"],
          ["public/content/site.json", "+3 −3"],
        ];

  return (
    <div className="mt-1 overflow-hidden rounded-xl border border-border/80 bg-card/50">
      <div className="flex items-center justify-between border-b border-border/70 px-3 py-2.5">
        <div className="flex items-center gap-2 text-xs font-medium">
          <span className="grid size-5 place-items-center rounded-full bg-emerald-500/12 text-emerald-400">
            <Check className="size-3" strokeWidth={2.5} />
          </span>
          {visibleChanges.length} {visibleChanges.length === 1 ? "change" : "changes"} ready
        </div>
        <span className="font-mono text-[10px] text-muted-foreground">draft-08</span>
      </div>
      <div className="space-y-0.5 p-1.5">
        {visibleChanges.map(([file, count]) => (
          <div
            className="flex items-center justify-between rounded-lg px-2 py-2 text-[11px] hover:bg-muted/50"
            key={file}
          >
            <span className="flex min-w-0 items-center gap-2 text-muted-foreground">
              <FileCode2 className="size-3.5 shrink-0" />
              <span className="truncate font-mono">{file}</span>
            </span>
            <span className="ml-3 shrink-0 font-mono text-emerald-400/90">{count}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function BakeryPreview({
  content,
  edited,
}: {
  content: SiteContent;
  edited: boolean;
}) {
  return (
    <div className="h-full min-h-[560px] overflow-hidden bg-[#f3eee5] text-[#2b211c]">
      <div className="flex h-12 items-center justify-between border-b border-[#342821]/10 px-5 text-[10px] uppercase tracking-[0.16em]">
        <span className="font-semibold">Marigold Bakehouse</span>
        <div className="hidden items-center gap-6 sm:flex">
          <span>Menu</span>
          <span>Our story</span>
          <span>Visit</span>
        </div>
        <span className="rounded-full border border-[#342821]/20 px-3 py-1.5">Order online</span>
      </div>

      <section className="grid min-h-[440px] grid-cols-1 lg:grid-cols-[.9fr_1.1fr]">
        <div className="flex flex-col justify-between px-7 py-9 sm:px-10 sm:py-12">
          <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-[#7e5f4e]">
            {content.eyebrow}
          </span>
          <div className="my-10 max-w-md">
            <h1
              className={`font-serif text-[clamp(3rem,6.7vw,6.7rem)] leading-[0.86] tracking-[-0.065em] transition-all duration-700 ${
                edited ? "translate-y-0 opacity-100" : "translate-y-1 opacity-95"
              }`}
            >
              {content.headline} <i>{content.emphasis}</i> here.
            </h1>
            <p className="mt-6 max-w-sm text-sm leading-6 text-[#5f5047]">
              {content.body}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <button className="rounded-full bg-[#2b211c] px-5 py-3 text-[10px] uppercase tracking-[0.14em] text-[#fff9ef]" type="button">
              {content.cta}
            </button>
            <span className="text-[10px] uppercase tracking-[0.14em] text-[#7e5f4e]">{content.hours}</span>
          </div>
        </div>
        <div
          aria-label="Fresh pastries arranged on a bakery counter"
          className="relative min-h-[300px] bg-cover bg-center"
          role="img"
          style={{
            backgroundImage:
              "linear-gradient(180deg, rgba(43,33,28,.02), rgba(43,33,28,.18)), url('https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=1600&q=88')",
          }}
        >
          <span className="absolute bottom-5 left-5 rounded-full bg-[#f3eee5]/90 px-3 py-2 text-[9px] uppercase tracking-[0.14em] backdrop-blur-sm">
            Croissants · 7:14 am
          </span>
        </div>
      </section>
      <div className="grid grid-cols-3 border-t border-[#342821]/10 text-center text-[9px] uppercase tracking-[0.14em] text-[#6f5b50]">
        <span className="border-r border-[#342821]/10 px-2 py-4">Local flour</span>
        <span className="border-r border-[#342821]/10 px-2 py-4">Natural leaven</span>
        <span className="px-2 py-4">Always butter</span>
      </div>
    </div>
  );
}

export function SnoballWorkspace({
  authEnabled,
  initialSiteContent,
  viewer,
}: {
  authEnabled: boolean;
  initialSiteContent: SiteContent;
  viewer: Viewer;
}) {
  const [messages, setMessages] = useState(initialMessages);
  const [status, setStatus] = useState<ChatStatus>("ready");
  const [agentStatus, setAgentStatus] = useState("Opening the site workspace");
  const [siteContent, setSiteContent] = useState(initialSiteContent);
  const [threadToken, setThreadToken] = useState<string>();
  const [edited, setEdited] = useState(true);
  const [publishState, setPublishState] = useState<"draft" | "publishing" | "live">("draft");
  const [device, setDevice] = useState<"desktop" | "tablet" | "mobile">("desktop");
  const [mobilePanel, setMobilePanel] = useState<"preview" | "assistant">("preview");
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(
    () => () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    },
    []
  );

  const submitPrompt = useCallback(
    async (message: PromptInputMessage) => {
      if (!message.text.trim() && message.files.length === 0) return;

      const requestText =
        message.text.trim() || "Use the attached reference for this update.";
      const fileNote = message.files.length
        ? `\n\nAttached ${message.files.length} reference ${message.files.length === 1 ? "file" : "files"}.`
        : "";
      const userId = Date.now();
      const assistantId = userId + 1;
      let assistantText = "";
      let latestChanges: NonNullable<ChatMessage["changes"]> = [];
      let assistantAdded = false;

      const upsertAssistant = () => {
        const nextMessage: ChatMessage = {
          id: assistantId,
          from: "assistant",
          text: assistantText || "Working on your site…",
          changes: latestChanges,
          showChangeSet: latestChanges.length > 0,
        };

        setMessages((current) => {
          const exists = current.some((item) => item.id === assistantId);
          assistantAdded = true;
          return exists
            ? current.map((item) =>
                item.id === assistantId ? nextMessage : item
              )
            : [...current, nextMessage];
        });
      };

      setMessages((current) => [
        ...current,
        {
          id: userId,
          from: "user",
          text: `${requestText}${fileNote}`,
        },
      ]);
      setStatus("submitted");
      setAgentStatus("Connecting to Codex");
      setPublishState("draft");

      try {
        const response = await fetch("/api/codex", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            prompt: requestText,
            siteId: "marigold",
            threadToken,
            files: message.files.map((file) => ({
              filename: file.filename,
              mediaType: file.mediaType,
              url: file.url,
            })),
          }),
        });

        if (!response.ok) {
          const body = (await response.json().catch(() => null)) as
            | { error?: string }
            | null;
          throw new Error(body?.error || "Codex could not start this edit.");
        }
        if (!response.body) {
          throw new Error("Codex returned an empty response.");
        }

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

            if (payload.type === "thread") {
              setThreadToken(payload.threadToken);
            } else if (payload.type === "status") {
              setAgentStatus(payload.label);
            } else if (payload.type === "file_change") {
              const byPath = new Map(
                [...latestChanges, ...payload.changes].map((change) => [
                  change.path,
                  change,
                ])
              );
              latestChanges = [...byPath.values()];
              upsertAssistant();
            } else if (payload.type === "message") {
              assistantText = payload.text;
              upsertAssistant();
            } else if (payload.type === "site_content") {
              setEdited(false);
              setSiteContent(payload.content);
              requestAnimationFrame(() => setEdited(true));
            } else if (payload.type === "error") {
              throw new Error(payload.message);
            }
          }

          if (done) break;
        }

        if (!assistantAdded) {
          assistantText =
            "The edit is complete. Review the updated preview before publishing.";
          upsertAssistant();
        }
        setStatus("ready");
      } catch (error) {
        assistantText = `I couldn’t complete that change: ${
          error instanceof Error ? error.message : "Unknown Codex error"
        }`;
        upsertAssistant();
        setStatus("error");
        timerRef.current = setTimeout(() => setStatus("ready"), 1800);
      }
    },
    [threadToken]
  );

  const publish = useCallback(() => {
    if (publishState !== "draft") return;
    setPublishState("publishing");
    timerRef.current = setTimeout(() => setPublishState("live"), 1150);
  }, [publishState]);

  const handleSuggestion = useCallback((text: string) => {
    void submitPrompt({ files: [], text });
  }, [submitPrompt]);

  const widthClass =
    device === "mobile"
      ? "max-w-[390px]"
      : device === "tablet"
        ? "max-w-[760px]"
        : "max-w-[1180px]";
  const pendingChangeCount =
    [...messages]
      .reverse()
      .find((message) => message.changes?.length)?.changes?.length ?? 3;

  return (
    <main className="workspace-enter min-h-screen bg-background text-foreground lg:h-screen lg:overflow-hidden">
      <header className="flex h-14 items-center border-b bg-background/95 px-3 backdrop-blur md:px-4">
        <div className="w-[230px] shrink-0">
          <SnoballMark />
        </div>
        <div className="hidden min-w-0 flex-1 items-center gap-3 md:flex">
          <button className="flex min-w-0 items-center gap-2 rounded-lg px-2.5 py-1.5 text-sm hover:bg-muted" type="button">
            <span className="grid size-6 shrink-0 place-items-center rounded-md bg-[#e7b44d] text-[10px] font-bold text-[#312312]">M</span>
            <span className="truncate font-medium">Marigold Bakery</span>
            <ChevronDown className="size-3.5 text-muted-foreground" />
          </button>
          <span className="h-4 w-px bg-border" />
          <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <span className={`size-1.5 rounded-full ${publishState === "live" ? "bg-emerald-400" : "bg-amber-400"}`} />
            {publishState === "live" ? "Published just now" : "Draft changes"}
          </span>
        </div>
        <div className="ml-auto flex items-center gap-1.5">
          <Button className="hidden h-8 gap-1.5 text-xs sm:flex" size="sm" variant="ghost">
            <Users className="size-3.5" />
            Invite
          </Button>
          <Button aria-label="Help" className="size-8" size="icon" variant="ghost">
            <CircleHelp className="size-4" />
          </Button>
          <AccountMenu authEnabled={authEnabled} initials={viewer.initials} />
        </div>
      </header>

      <div className="grid h-[calc(100svh-3.5rem)] grid-cols-1 lg:grid-cols-[64px_minmax(0,1fr)_400px]">
        <aside className="hidden flex-col items-center justify-between border-r bg-sidebar py-4 lg:flex">
          <nav className="flex flex-col gap-1.5">
            <NavIcon active label="Workspace"><LayoutDashboard className="size-4" /></NavIcon>
            <NavIcon label="Sites"><Globe2 className="size-4" /></NavIcon>
            <NavIcon label="Activity"><History className="size-4" /></NavIcon>
            <NavIcon label="Analytics"><Gauge className="size-4" /></NavIcon>
            <NavIcon label="Team"><Users className="size-4" /></NavIcon>
          </nav>
          <nav className="flex flex-col gap-1.5">
            <NavIcon label="Settings"><Settings className="size-4" /></NavIcon>
            <NavIcon label="Collapse sidebar"><PanelRightClose className="size-4" /></NavIcon>
          </nav>
        </aside>

        <section className={`${mobilePanel === "assistant" ? "hidden lg:flex" : "flex"} h-full min-w-0 flex-col overflow-hidden bg-[#151412]`}>
          <div className="flex h-12 shrink-0 items-center justify-between border-b px-3 sm:px-4">
            <div className="flex min-w-0 items-center gap-1">
              <Button aria-label="Back" className="size-7" size="icon" variant="ghost"><ArrowLeft className="size-3.5" /></Button>
              <span className="mx-1 h-4 w-px bg-border" />
              <button className="flex min-w-0 items-center gap-1.5 rounded-md px-2 py-1 text-xs hover:bg-muted" type="button">
                <span className="truncate">Home</span>
                <ChevronDown className="size-3 text-muted-foreground" />
              </button>
            </div>

            <div className="absolute left-1/2 hidden -translate-x-1/2 items-center rounded-lg border bg-muted/35 p-0.5 sm:flex">
              {deviceOptions.map(({ name, icon: Icon }) => (
                <button
                  aria-label={`${name} preview`}
                  className={`grid size-7 place-items-center rounded-md transition ${device === name ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
                  key={name}
                  onClick={() => setDevice(name)}
                  type="button"
                >
                  <Icon className="size-3.5" />
                </button>
              ))}
            </div>

            <div className="flex items-center gap-1.5">
              <Button className="hidden h-8 gap-1.5 text-xs xl:flex" size="sm" variant="ghost">
                <ExternalLink className="size-3.5" />
                Open site
              </Button>
              <Button
                className={`h-8 gap-1.5 text-xs ${publishState === "draft" ? "publish-ready" : ""}`}
                disabled={publishState !== "draft"}
                onClick={publish}
                size="sm"
              >
                {publishState === "publishing" ? <RefreshCw className="size-3.5 animate-spin" /> : publishState === "live" ? <Check className="size-3.5" /> : <Rocket className="size-3.5" />}
                {publishState === "publishing"
                  ? "Publishing"
                  : publishState === "live"
                    ? "Live"
                    : `Publish ${pendingChangeCount}`}
              </Button>
            </div>
          </div>

          <div className="flex min-h-0 flex-1 justify-center overflow-auto bg-[radial-gradient(circle_at_50%_0%,oklch(0.24_0.012_48/.55),transparent_38%)] p-3 sm:p-5">
            <div className={`preview-enter my-auto w-full ${widthClass} overflow-hidden rounded-[14px] border border-white/10 bg-white shadow-[0_24px_80px_rgba(0,0,0,.34)] transition-[max-width] duration-500`}>
              <div className="flex h-8 items-center gap-2 border-b border-black/10 bg-[#e7e4de] px-3">
                <div className="flex gap-1"><span className="size-2 rounded-full bg-[#ff6a5f]" /><span className="size-2 rounded-full bg-[#ffbd45]" /><span className="size-2 rounded-full bg-[#46c45a]" /></div>
                <div className="mx-auto flex h-5 w-[44%] items-center justify-center rounded-md bg-white/70 font-mono text-[8px] text-black/45">marigoldbakehouse.com</div>
                <MoreHorizontal className="size-3 text-black/30" />
              </div>
              <BakeryPreview content={siteContent} edited={edited} />
            </div>
          </div>

          <div className="flex h-12 items-center justify-center gap-1 border-t lg:hidden">
            <Button className="h-8 gap-1.5 text-xs" onClick={() => setMobilePanel("preview")} size="sm" variant="secondary"><Eye className="size-3.5" />Preview</Button>
            <Button className="h-8 gap-1.5 text-xs" onClick={() => setMobilePanel("assistant")} size="sm" variant="ghost"><Sparkles className="size-3.5" />Assistant</Button>
          </div>
        </section>

        <aside className={`${mobilePanel === "preview" ? "hidden lg:flex" : "flex"} h-full min-h-0 min-w-0 flex-col overflow-hidden border-l bg-background`}>
          <div className="flex h-12 shrink-0 items-center justify-between border-b px-4">
            <div className="flex items-center gap-2">
              <span className="grid size-6 place-items-center rounded-md bg-primary/12 text-primary"><WandSparkles className="size-3.5" /></span>
              <div>
                <p className="text-xs font-semibold">Site assistant</p>
                <p className="flex items-center gap-1 text-[9px] text-muted-foreground"><ShieldCheck className="size-2.5" /> Review required to publish</p>
              </div>
            </div>
            <div className="flex items-center gap-0.5">
              <Button aria-label="View code" className="size-7" size="icon" variant="ghost"><Code2 className="size-3.5" /></Button>
              <Button aria-label="Close assistant" className="size-7 lg:hidden" onClick={() => setMobilePanel("preview")} size="icon" variant="ghost"><X className="size-3.5" /></Button>
            </div>
          </div>

          <Conversation className="min-h-0 flex-1">
            <ConversationContent className="gap-5 px-4 py-5">
              <div className="mb-1 flex items-center gap-2 text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
                <span className="h-px flex-1 bg-border" /> Today <span className="h-px flex-1 bg-border" />
              </div>
              {messages.map((message) => (
                <Message from={message.from} key={message.id}>
                  <MessageContent>
                    <MessageResponse>{message.text}</MessageResponse>
                    {message.showChangeSet && (
                      <ChangeSet changes={message.changes} />
                    )}
                  </MessageContent>
                </Message>
              ))}
              {(status === "submitted" || status === "streaming") && (
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span className="flex gap-1"><i className="size-1.5 animate-bounce rounded-full bg-primary [animation-delay:-.2s]" /><i className="size-1.5 animate-bounce rounded-full bg-primary [animation-delay:-.1s]" /><i className="size-1.5 animate-bounce rounded-full bg-primary" /></span>
                  {agentStatus}…
                </div>
              )}
            </ConversationContent>
            <ConversationScrollButton />
          </Conversation>

          <div className="shrink-0 border-t bg-background px-3 pb-3 pt-2.5">
            <div className="hide-scrollbar mb-2 flex gap-1.5 overflow-x-auto">
              {suggestions.map((suggestion) => (
                <button className="shrink-0 rounded-full border bg-card/40 px-2.5 py-1.5 text-[10px] text-muted-foreground transition hover:border-primary/40 hover:text-foreground" key={suggestion} onClick={() => handleSuggestion(suggestion)} type="button">{suggestion}</button>
              ))}
            </div>
            <PromptInput
              accept="image/*,application/pdf"
              className="[&_[data-slot=input-group]]:rounded-xl [&_[data-slot=input-group]]:bg-card/60 [&_[data-slot=input-group]]:shadow-none"
              maxFiles={4}
              multiple
              onSubmit={submitPrompt}
            >
              <ComposerAttachments />
              <PromptInputBody>
                <PromptInputTextarea placeholder="Ask Snoball to change anything…" />
              </PromptInputBody>
              <PromptInputFooter>
                <PromptInputTools>
                  <ComposerAttachButton />
                  <PromptInputButton className="gap-1.5 text-[10px] text-muted-foreground" size="sm" tooltip="Choose edit mode">
                    <MousePointer2 className="size-3" /> Edit
                  </PromptInputButton>
                </PromptInputTools>
                <PromptInputSubmit disabled={status !== "ready"} status={status} />
              </PromptInputFooter>
            </PromptInput>
            <div className="mt-2 flex items-center justify-between px-1 text-[9px] text-muted-foreground/70">
              <span className="flex items-center gap-1"><Bot className="size-2.5" /> Drafts changes before publishing</span>
              <span className="font-mono">⌘ ↵</span>
            </div>
          </div>

          <div className="flex h-12 items-center justify-center gap-1 border-t lg:hidden">
            <Button className="h-8 gap-1.5 text-xs" onClick={() => setMobilePanel("preview")} size="sm" variant="ghost"><Eye className="size-3.5" />Preview</Button>
            <Button className="h-8 gap-1.5 text-xs" onClick={() => setMobilePanel("assistant")} size="sm" variant="secondary"><Sparkles className="size-3.5" />Assistant</Button>
          </div>
        </aside>
      </div>
    </main>
  );
}
