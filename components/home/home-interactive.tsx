"use client";

import { ArrowRight, Check, Github, Globe, Linkedin, Mail, Twitter } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { SocialLinkPreview } from "@/components/common";
import { InlineContact } from "@/components/home/inline-contact";
import { Button } from "@/components/ui/button";
import { pillLinkClass } from "@/components/ui/pill";
import { StatusPill } from "@/components/ui/status-pill";

const socials = [
  { id: "github", label: "GitHub", href: "https://github.com/byronwade", icon: Github },
  { id: "linkedin", label: "LinkedIn", href: "https://linkedin.com/in/byronwade", icon: Linkedin },
  { id: "twitter", label: "X", href: "https://twitter.com/byron_c_wade", icon: Twitter },
  { id: "thorbis", label: "Thorbis", href: "https://thorbis.com", icon: Globe },
] as const;

const pillClass = pillLinkClass;

export function HomeInteractive() {
  const [copiedButton, setCopiedButton] = useState<string | null>(null);
  const [contactOpen, setContactOpen] = useState(false);
  const email = "byron@byronwade.com";

  const copyEmail = async (buttonId: string) => {
    try {
      await navigator.clipboard.writeText(email);
      setCopiedButton(buttonId);
      setTimeout(() => setCopiedButton(null), 2000);
    } catch (error) {
      console.warn("Clipboard copy unavailable", error);
      setContactOpen(true);
    }
  };

  const handleEmailClick = (buttonId: string) => {
    setContactOpen(true);
    if (buttonId !== "panel") copyEmail(buttonId);
  };

  return (
    <section className="reveal flex w-full flex-col gap-8">
      <InlineContact open={contactOpen} onClose={() => setContactOpen(false)} email={email} />

      <div className="flex flex-col items-start gap-6">
        <div className="relative">
          <div
            className="glow-brand pointer-events-none absolute -inset-6 opacity-70"
            aria-hidden
          />
          <div className="relative size-20 overflow-hidden rounded-full ring-1 ring-border sm:size-24">
            <Image
              alt="Byron Wade — Full Stack Developer"
              className="size-full object-cover"
              src="/avatar.avif"
              width={96}
              height={96}
              loading="eager"
              priority
            />
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <h1 className="font-heading text-4xl font-semibold tracking-tight sm:text-5xl">
            Byron Wade
          </h1>
          <p className="max-w-xl text-lg leading-snug text-foreground sm:text-xl">
            I build software for service businesses — from the field up.
          </p>
          <p className="text-base text-muted-foreground sm:text-lg">
            Full-stack developer · operator · Jasper, Georgia
          </p>
          <StatusPill tone="success" pulse className="w-fit">
            Available for product builds & conversations
          </StatusPill>
        </div>
      </div>

      <div className="flex flex-col gap-5 text-base leading-relaxed text-muted-foreground">
        <p className="reveal reveal-delay-1">
          I grew a plumbing company to <span className="font-semibold text-brand">$2.4M</span> in
          year-two revenue, then started building the tools I wished we had — dispatch, reputation,
          phones, and the shared UI system underneath them.
        </p>

        <p className="reveal reveal-delay-2">
          Today I’m building{" "}
          <a
            href="https://thorbis.com"
            target="_blank"
            rel="noopener noreferrer"
            className="link-underline font-medium"
          >
            Thorbis
          </a>
          , a field management platform for trades. Real problems from the truck and the office,
          solved in code.
        </p>

        <p className="reveal reveal-delay-3 text-foreground">
          Open to conversations about product engineering, design systems, and software for service
          businesses.
        </p>
      </div>

      <div className="reveal reveal-delay-4 flex flex-wrap items-center gap-2">
        <Button type="button" size="lg" onClick={() => setContactOpen(true)} className="gap-2">
          Start a conversation
          <ArrowRight className="size-4" aria-hidden="true" />
        </Button>
        <Button
          size="lg"
          variant="outline"
          render={<Link href="/projects">See selected work</Link>}
        />
      </div>

      <div className="reveal reveal-delay-5 flex flex-wrap items-center gap-2">
        {socials.map((social) =>
          social.id === "github" ? (
            <SocialLinkPreview key={social.id} platform="github">
              <a
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className={pillClass}
                aria-label={social.label}
              >
                <social.icon className="size-4" />
                {social.label}
              </a>
            </SocialLinkPreview>
          ) : (
            <a
              key={social.id}
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              className={pillClass}
              aria-label={social.label}
            >
              <social.icon className="size-4" />
              {social.label}
            </a>
          )
        )}
        <button type="button" onClick={() => handleEmailClick("social")} className={pillClass}>
          {copiedButton === "social" ? (
            <Check className="size-4 text-brand" />
          ) : (
            <Mail className="size-4" />
          )}
          {copiedButton === "social" ? "Copied!" : "Email"}
        </button>
      </div>
    </section>
  );
}
