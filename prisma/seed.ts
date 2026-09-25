import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const DEMO_PASSWORD = process.env.DEMO_PASSWORD || "";

async function main() {
  const passwordHash = await bcrypt.hash(DEMO_PASSWORD, 10);

  const [superAdmin, admin, staff, member] = await Promise.all([
    prisma.user.upsert({
      where: { email: process.env.SUPER_ADMIN as string },
      update: {},
      create: {
        name: "Frederick Jones",
        email: process.env.SUPER_ADMIN as string,
        passwordHash,
        role: "super_admin",
      },
    }),
    prisma.user.upsert({
      where: { email: process.env.ADMIN_AMAKA as string },
      update: {},
      create: { name: "Amaka Obi", email: process.env.ADMIN_AMAKA as string, passwordHash, role: "admin" },
    }),
    prisma.user.upsert({
      where: { email: process.env.ADMIN_TUNDE as string },
      update: {},
      create: { name: "Tunde Bakare", email: process.env.ADMIN_TUNDE as string, passwordHash, role: "staff" },
    }),
    prisma.user.upsert({
      where: { email: process.env.ADMIN_NWOSU as string },
      update: {},
      create: { name: "Chiamaka Nwosu", email: process.env.ADMIN_NWOSU as string, passwordHash, role: "user" },
    }),
  ]);

  await prisma.post.createMany({
    skipDuplicates: true,
    data: [
      {
        title: "Welcome to the New SEEDAN Portal",
        slug: "welcome-to-the-new-seedan-portal",
        category: "Announcements",
        excerpt: "SEEDAN's new institutional platform is here — membership, dues, resources and events, all in one place.",
        coverImageUrl: '/uploads/1790331822915-90a96235.jpg',
        contentHtml:
          "SEEDAN\'s new institutional platform is here — membership, dues, resources and events, all in one place.', '/uploads/1790331822915-90a96235.jpg', '<p><strong>W</strong>e are here to make the most of this period in history to help with many things that have not come to the attention of many regarding how life is made better by our insistence of technological advancement over crude and outdated approach to production and food management.</p><p>We\'re excited to launch SEEDAN\'s new institutional platform. Members can now register online, track their dues, and access resources without waiting on a phone call.</p><div data-columns=\"2\" data-type=\"image-grid\" class=\"img-grid img-grid-2\"><div class=\"img-grid-cell\"><img src=\"/uploads/1790337994464-505ed209.jpg\"></div><div class=\"img-grid-cell\"><img src=\"/uploads/1790337998576-3ae2157f.jpg\"></div></div><p>Explore the <strong>Membership</strong> section to get started, or browse upcoming events below.</p><ul><li><p>Be a farmer</p></li><li><p>Be a leader</p></li><li><p>Be a patriotic citizen</p></li></ul><p>At the end of that session, you kindly agreed to share the discussion internally with your team and to come back to us with feedback on the areas of possible collaboration. It has now been some weeks, and we wanted to check in respectfully to ask whether there has been any progress on your side, and whether there is anything further from us that would help your team reach a decision.</p>",
        status: "published",
        authorId: admin.id,
        publishedAt: new Date("2026-08-10"),
      },
      {
        title: "2026 Entrepreneurship Summit: Highlights",
        slug: "2026-entrepreneurship-summit-highlights",
        category: "Events",
        excerpt: "Over 400 members gathered in Abuja for this year's summit. Here's what you missed.",
        coverImageUrl: 'https://res.cloudinary.com/dnl81n8vu/image/upload/v1790351927/seedan-demo/file_icrba7.png',
        contentHtml:
          "<p>This year\'s summit brought together entrepreneurs from all six geo-political zones for two days of workshops, funding clinics, and networking.<br></p><div data-columns=\"2\" data-type=\"image-grid\" class=\"img-grid img-grid-2\"><div class=\"img-grid-cell\"><img src=\"https://res.cloudinary.com/dnl81n8vu/image/upload/v1790351735/seedan-demo/file_qlkjsf.jpg\"></div><div class=\"img-grid-cell\"><img src=\"https://res.cloudinary.com/dnl81n8vu/image/upload/v1790351798/seedan-demo/file_jjcwbq.jpg\"></div></div><p>Photos and session recordings are available in the Resources section for registered members.</p>",
        status: "published",
        authorId: staff.id,
        publishedAt: new Date("2026-09-02"),
      },
      {
        title: "How to Apply for SEEDAN Membership",
        slug: "how-to-apply-for-seedan-membership",
        category: "Membership",
        excerpt:
          "A step-by-step walkthrough of the new online application and approval process.",
        coverImageUrl: 'https://res.cloudinary.com/dnl81n8vu/image/upload/v1790351798/seedan-demo/file_jjcwbq.jpg',
        contentHtml:
          "<p>Applying is now fully online. Fill out the application form, upload your supporting documents, and track your approval status from your dashboard — no more paper forms.</p><img src=\"/uploads/1790335561101-df6c9ecb.png\"><img src=\"/uploads/1790335574395-a90cfacf.jpg\">",
        status: "published",
        authorId: admin.id,
        publishedAt: new Date("2026-09-15"),
      },
      {
        title: "Draft: Q4 Dues Reminder (not yet published)",
        slug: "q4-dues-reminder-draft",
        category: "Announcements",
        excerpt: "Internal draft — reminder copy for the Q4 dues cycle, pending admin review.",
        coverImageUrl: '/uploads/1790335505934-323bf7eb.png',
        contentHtml:
          "<p>Draft copy: Q4 dues are due by December 15th. Members can pay directly from their dashboard via Paystack.</p>",
        status: "draft",
        authorId: staff.id,
        publishedAt: null,
      },
    ],
  });

  await prisma.member.createMany({
    skipDuplicates: true,
    data: [
      {
        fullName: "Chiamaka Nwosu",
        organizationName: "Nwosu Fresh Produce Ltd",
        email: "member@seedan.gov.ng",
        phone: "0803 000 0001",
        category: "Agribusiness",
        stateOfOperation: "Enugu",
        status: "approved",
        userId: member.id,
      },
      {
        fullName: "Ibrahim Musa",
        organizationName: "Musa AgroTech",
        email: "ibrahim.musa@gmail.com",
        phone: "0803 000 0002",
        category: "Agribusiness",
        stateOfOperation: "Kano",
        status: "pending",
      },
      {
        fullName: "Funmilayo Adebayo",
        organizationName: "Adebayo Textiles",
        email: "funmi.adebayo@gmail.com",
        phone: "0803 000 0003",
        category: "Manufacturing",
        stateOfOperation: "Lagos",
        status: "pending",
      },
      {
        fullName: "Emeka Okafor",
        organizationName: "Okafor Logistics",
        email: "emeka.okafor@gmail.com",
        phone: "0803 000 0004",
        category: "Logistics",
        stateOfOperation: "Anambra",
        status: "suspended",
        reviewNote: "Dues outstanding since Q2 2026 — suspended pending payment.",
      },
      {
        fullName: "Grace Effiong",
        organizationName: "Effiong Craft Exports",
        email: "grace.effiong@gmail.com",
        phone: "0803 000 0005",
        category: "Handicrafts",
        stateOfOperation: "Akwa Ibom",
        status: "rejected",
        reviewNote: "Incomplete documentation — CAC certificate not provided.",
      },
      {
        fullName: "Segun Oyelaran",
        organizationName: "Oyelaran Foods",
        email: "segun.oyelaran@gmail.com",
        phone: "0803 000 0006",
        category: "Agribusiness",
        stateOfOperation: "Oyo",
        status: "pending",
      },
    ],
  });

  console.log("Seed complete. Demo login password for all accounts:", DEMO_PASSWORD);
  console.log({
    super_admin: superAdmin.email,
    admin: admin.email,
    staff: staff.email,
    user: member.email,
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
