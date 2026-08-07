---
title: "Seven Engineering Lessons From Building Software for People Who Work in Trucks"
date: 2024-03-10
updated: 2026-08-07
excerpt: "Field-service software is used with one hand, weak signal, a customer watching, and real money attached to every mistake. Those constraints change how the product should be designed, modeled, secured, and measured."
tags:
  - Field service
  - Product engineering
  - Performance
  - Mobile
  - Lessons
---

Most software is designed in an environment that hides the conditions under which it will actually be used.

The developer has a fast laptop, stable internet, a large monitor, clean hands, test data, and enough time to think. The field technician has a phone, poor signal, a customer watching, a wet crawlspace, three more calls scheduled, and one hand available.

Those are not minor differences.

They change the architecture.

I have spent years moving between plumbing work and software development, and building [Thorbis](https://thorbis.com) has made one point increasingly clear: **field-service software is not ordinary business software with a mobile layout added later.**

The environment, workflow, and consequences are different.

A slow screen is labor. A missing note is a broken promise. A duplicate customer record is lost context. A failed offline sync can erase work. A permission mistake can expose another company’s data. An AI action that cannot be explained can damage a customer relationship before the owner knows it happened.

These are the engineering lessons I now treat as product requirements.

## 1. The real interface is the environment

A field technician does not experience the application as a collection of components.

The technician experiences it while climbing out of a truck, carrying a tool bag, wearing gloves, standing in sunlight, walking through a customer’s house, or trying to finish notes before the next appointment.

That means a mobile interface cannot be judged only by whether it technically fits on a small screen.

It has to answer practical questions:

- Can the next action be found without reading the entire page?
- Can the control be used with a thumb while the phone is moving?
- Can the technician recognize the customer, property, and reason for the call immediately?
- Can a photo, measurement, or note be attached to the correct job without a separate filing step?
- Can the technician recover from an accidental tap?
- Does the screen still make sense when content is longer than the designer expected?
- Can the workflow be completed without typing the same information twice?

Accessibility guidance supports the same direction. [WCAG 2.2](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum) sets a Level AA minimum target-size requirement of 24 by 24 CSS pixels, with specific exceptions, while its stricter Level AAA guidance recommends 44 by 44 pixels for custom targets. I treat 44 pixels as a useful design target for important field controls, not because every button is legally required to be that size, but because one-handed use, large fingers, vibration, glare, and imperfect movement are normal in the field.

The environment is part of the interface.

A design that only works when the user is sitting still at a desk is not field-service design.

## 2. Measure task time, not only page speed

I care deeply about performance, but performance scores can become another abstraction.

Google’s current [Core Web Vitals](https://web.dev/articles/vitals) are Largest Contentful Paint, Interaction to Next Paint, and Cumulative Layout Shift. The “good” thresholds are 2.5 seconds or less for LCP, 200 milliseconds or less for INP, and 0.1 or less for CLS at the 75th percentile.

Those are useful guardrails. They are not the finished definition of a fast product.

A screen can meet the performance thresholds and still waste the technician’s time through:

- unnecessary route changes,
- repeated confirmation steps,
- a search that requires exact spelling,
- forms that ask for known information,
- settings mixed into daily work,
- slow camera or upload flows,
- context hidden behind several taps,
- and client-side interactions that feel delayed even after the page loaded.

The business measurement is closer to this:

`Task cost = time × frequency × number of users × loaded labor rate`

Assume a workflow contains six unnecessary interactions that cost ten seconds each. A technician repeats that workflow six times per day. Eight technicians use it across 250 working days.

The annual waste is:

`6 interactions × 10 seconds × 6 jobs × 8 technicians × 250 days`

That equals 720,000 seconds, or **200 hours per year**.

At an illustrative loaded labor cost of $45 per hour:

`200 × $45 = $9,000 per year`

That is the cost of one minute of friction repeated across a normal workflow. It does not include the jobs that run late, the office calls created by confusion, or the paperwork finished after hours.

This is why I measure both technical and operational performance.

The application should load quickly, respond quickly, remain stable, and also let a qualified person finish the work with fewer decisions and less repeated input.

## 3. Server and client boundaries are product decisions

Modern React frameworks make it easy to put large parts of an application in the browser because interactivity feels productive.

That convenience can quietly increase JavaScript, hydration work, state synchronization, and the number of places where data can become stale.

The current [Next.js App Router documentation](https://nextjs.org/docs/app/getting-started/server-and-client-components) describes layouts and pages as Server Components by default. Client Components are intended for state, event handlers, lifecycle logic, browser APIs, and custom hooks. That is more than a framework detail. It is a useful architectural pressure.

My default question is not, “Can this be interactive?”

It is, “Where does this behavior actually need to live?”

A customer header, job history, invoice summary, equipment list, or reporting view can often be rendered on the server and delivered with less client JavaScript. A signature pad, map interaction, live dispatch board, camera flow, or offline queue needs client behavior.

The boundary should stay narrow.

Good reasons to keep logic on the server include:

- credentials and secrets remain private,
- authorization can be enforced near the data,
- less JavaScript reaches the field device,
- initial rendering can begin before every interactive dependency loads,
- and there are fewer competing sources of client state.

Good reasons to use the client include:

- immediate input feedback,
- local drafts,
- camera and location access,
- drag-and-drop,
- optimistic updates,
- offline storage,
- and real-time interaction.

The mistake is turning the entire page into a Client Component because one button needs a click handler.

Field devices are not where I want to pay for unnecessary architecture.

## 4. Offline is a data-consistency problem

“Works offline” sounds like a feature.

In reality, it is a collection of product decisions about stale data, ownership, conflicts, retries, storage, and trust.

A service worker can intercept requests and apply caching strategies. The [web.dev offline cookbook](https://web.dev/articles/offline-cookbook) documents patterns such as cache-first, network-first, stale-while-revalidate, and background synchronization.

That is the delivery layer.

The harder questions begin after the technician changes real business data without a connection:

- What happens if dispatch changes the appointment while the technician is offline?
- What happens if the office edits the estimate while the field has a draft?
- Can two photos upload twice after a retry?
- Can a payment action be repeated?
- Does the user know which information is current?
- How long can customer or job data remain on the device?
- What happens when a queued action is no longer valid?
- Which side wins when the same field changed in two places?
- Can the technician see and resolve a conflict rather than silently losing work?

A serious offline design needs, at minimum:

- stable identifiers created before synchronization,
- idempotency for mutations that must not repeat,
- timestamps or versions for conflict detection,
- a visible queue with pending, failed, and completed states,
- clear retry behavior,
- bounded local storage,
- and rules for which data is safe and useful to cache.

Not every action should work offline.

Reading the day’s assigned jobs, taking notes, capturing photos, and filling a checklist may be reasonable. Charging a card, issuing a refund, changing payroll, or committing inventory across locations may require the system to confirm current state.

Offline capability should preserve useful work without pretending disconnected data is automatically correct.

## 5. The data model has to match the trade

Generic CRM models usually begin with a contact and an activity.

A field-service business needs a more physical model.

The customer is not the property. The property is not the job. The job is not the equipment. The estimate is not the approved scope. The invoice is not the payment. The technician’s note is not the customer-facing explanation.

Collapsing those concepts makes the first version easier and every later workflow harder.

A useful operational chain looks more like:

`account → contact → property → asset/equipment → request → job → visit → scope → estimate → approval → invoice → payment → warranty`

Different trades emphasize different parts.

A plumber may care about a water heater’s model, serial number, fuel type, venting, installation date, warranty, and service history. An HVAC company may track systems, zones, refrigerant, maintenance plans, and seasonal visits. A septic company may track tanks, pumps, control panels, disposal fields, permits, inspection levels, and pumping history.

The shared model should capture what is truly common. Trade-specific data should remain specific rather than being forced into generic notes.

This is where many large products become difficult to change. The data model was built around the first screens instead of the real objects in the business.

My rule is simple:

> Model the thing the company is responsible for, not merely the form currently used to describe it.

A clear data model makes search, reporting, permissions, automation, and AI dramatically easier because the meaning already exists in the structure.

## 6. Communication is part of the job record

Calls, texts, emails, photos, voicemails, estimates, and internal notes are often treated as separate product categories.

The business experiences them as one conversation.

A homeowner may call about low pressure, text a photo of the equipment, approve an estimate by email, ask a scheduling question through the portal, and discuss an additional issue with the technician on site. The next employee needs to understand the sequence, not search five applications.

The engineering challenge is not only displaying several channels in one inbox.

It is identity and context:

- Which customer and property does the message belong to?
- Is the sender the owner, tenant, property manager, or spouse?
- Which job or estimate is being discussed?
- Is the message visible to the customer or internal only?
- Did an automated message send because of a real state change?
- Can a reply be attributed to the employee or automation that produced it?
- Are attachments retained with the correct permissions and lifecycle?
- Can the system rebuild the timeline without duplicating events?

Communication should become durable operational data.

That lets the office see what was promised, the technician see what was already discussed, the manager audit what happened, and the customer avoid repeating the story.

A unified timeline is not an aesthetic feature. It is a protection against lost commitments.

## 7. Security and AI need the same rule: no invisible authority

Multi-tenant field-service software holds customer addresses, access notes, phone numbers, invoices, payment context, employee data, and sometimes sensitive details about who lives at a property.

A single missing tenant boundary is not a minor bug.

Authorization has to be enforced at the data boundary, not only by hiding a navigation item. Every read and mutation should answer:

- Who is making the request?
- Which company do they belong to?
- What role and scope do they have?
- Which record owns the resource?
- Is the action allowed in the record’s current state?
- What audit evidence should remain?

This is why row-level policies, server-side authorization, validated inputs, scoped storage, and audit logs matter. They are not compliance decorations. They are the mechanism that keeps one company from seeing or changing another company’s operation.

AI should follow the same principle.

An AI feature becomes dangerous when it gains broad authority while remaining hard to inspect. “The AI did it” is not an acceptable explanation for a customer message, schedule change, estimate adjustment, payment action, or employee decision.

I want AI behavior to be:

- **bounded** to a defined job,
- **grounded** in identified business data,
- **attributed** to a user or automation,
- **reviewable** before sensitive actions,
- **logged** after an action,
- and **reversible** where the business process allows it.

The distinction between recommendation and execution should be visible.

An assistant can say, “This invoice is 32 days overdue and the customer has not received a reminder.” The owner can decide whether the history makes an automated reminder appropriate.

The more the action affects money, employment, safety, or customer trust, the less invisible authority the system should have.

## The lesson underneath all seven

Building for the trades requires respect for the work.

That means respecting the technician’s time, the customer’s information, the owner’s financial reality, the office’s need for context, and the fact that software errors become real operational errors.

It also means avoiding two common forms of arrogance.

The first is technical arrogance: believing the newest framework feature automatically creates a better product.

The second is product arrogance: believing a clean office workflow represents the field.

Frameworks, databases, service workers, AI models, and design systems are tools. The product succeeds when those tools produce a workflow that remains clear under real pressure.

The engineering questions I now care about most are practical:

- How many times does the user have to make the same decision?
- What happens when the network disappears?
- What information can become stale?
- Which action cannot safely repeat?
- Where does authorization actually happen?
- Can another employee understand the customer history?
- Can the owner trace an automated decision?
- Does the system make the next correct action easier?

That is the standard for [Thorbis](https://thorbis.com), and it is the standard I would use for any software built for people whose work happens away from a desk.

Field-service software should not merely survive the truck.

It should feel like the truck was where the product started.
