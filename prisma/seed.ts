import "dotenv/config";
import { PrismaClient, TicketCategory, DeliveryMethod, PersonalizationStatus } from "@prisma/client";
import type { CryptoCurrency, CryptoNetwork, CryptoProviderName } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { hash } from "bcryptjs";

const connectionString = process.env.DATABASE_URL;
if (!connectionString) throw new Error("DATABASE_URL not set");
const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Seeding database...");

  // Clear existing tickets
  await prisma.ticket.deleteMany();

  const tickets = [
    {
      name: "Saturday Day Ticket",
      slug: "saturday-day-ticket",
      description: "Access to Awakenings Festival 2026 on Saturday July 11. Experience world-class techno across multiple stages at the legendary Hilvarenbeek venue. This ticket grants you full day access from gates open until close.",
      category: TicketCategory.SATURDAY,
      dayLabel: "Saturday 11 July",
      originalPrice: 79.50,
      resalePrice: 110,
      currency: "EUR",
      quantity: 3,
      sold: 0,
      isVisible: true,
      isFeatured: false,
      deliveryMethod: DeliveryMethod.NAME_CHANGE,
      personalizationStatus: PersonalizationStatus.PENDING,
      includes: ["Saturday festival access", "All stages included", "Name personalization service", "Digital e-ticket after transfer"],
    },
    {
      name: "Sunday Day Ticket",
      slug: "sunday-day-ticket",
      description: "Access to Awakenings Festival 2026 on Sunday July 12. Catch the closing performances from the world's finest techno artists at Hilvarenbeek Recreation Area, Amsterdam.",
      category: TicketCategory.SUNDAY,
      dayLabel: "Sunday 12 July",
      originalPrice: 79.50,
      resalePrice: 110,
      currency: "EUR",  
      quantity: 2,
      sold: 0,
      isVisible: true,
      isFeatured: false,
      deliveryMethod: DeliveryMethod.NAME_CHANGE,
      personalizationStatus: PersonalizationStatus.PENDING,
      includes: ["Sunday festival access", "All stages included", "Name personalization service", "Digital e-ticket after transfer"],
    },
    {
      name: "Weekend Ticket",
      slug: "weekend-ticket",
      description: "Full weekend access to Awakenings Festival 2026. Both Saturday July 11 and Sunday July 12 included. Experience the complete festival journey with access to all stages both days.",
      category: TicketCategory.WEEKEND,
      dayLabel: "10–12 July",
      originalPrice: 149.50,
      resalePrice: 210,
      currency: "EUR",
      quantity: 4,
      sold: 1,
      isVisible: true,
      isFeatured: true,
      deliveryMethod: DeliveryMethod.NAME_CHANGE,
      personalizationStatus: PersonalizationStatus.PENDING,
      includes: ["Full weekend access (Sat + Sun)", "All stages both days", "Name personalization service", "Digital e-tickets after transfer"],
    },
    {
      name: "Weekend Ticket + Camping",
      slug: "weekend-ticket-camping",
      description: "The complete Awakenings experience. Full weekend festival access plus camping for the night between Saturday and Sunday. Wake up on site and enjoy the full festival atmosphere.",
      category: TicketCategory.WEEKEND,
      dayLabel: "10–12 July + Camping",
      originalPrice: 189.50,
      resalePrice: 260,
      currency: "EUR",
      quantity: 2,
      sold: 0,
      isVisible: true,
      isFeatured: true,
      deliveryMethod: DeliveryMethod.NAME_CHANGE,
      personalizationStatus: PersonalizationStatus.PENDING,
      includes: ["Full weekend access (Sat + Sun)", "Camping overnight (Sat night)", "Campsite facilities access", "Name personalization service", "Digital e-tickets after transfer"],
    },
    {
      name: "Camping Ticket (add-on)",
      slug: "camping-ticket-addon",
      description: "Add-on camping pass for Awakenings Festival 2026. Requires a valid festival day ticket. Camp on site and extend your festival experience overnight.",
      category: TicketCategory.CAMPING,
      dayLabel: "Saturday Night",
      originalPrice: 39.50,
      resalePrice: 55,
      currency: "EUR",
      quantity: 5,
      sold: 0,
      isVisible: true,
      isFeatured: false,
      deliveryMethod: DeliveryMethod.DIGITAL,
      personalizationStatus: PersonalizationStatus.NOT_REQUIRED,
      includes: ["Overnight camping (Sat)", "Basic campsite facilities", "Shared shower facilities", "Secure luggage storage"],
    },
    {
      name: "Comfort Camping Package",
      slug: "comfort-camping-package",
      description: "Upgrade your camping experience at Awakenings 2026. The Comfort Camping package includes a pre-pitched tent, proper bedding, and access to premium facilities. The ideal way to rest between performances.",
      category: TicketCategory.COMFORT_CAMPING,
      dayLabel: "10–12 July",
      originalPrice: 149.50,
      resalePrice: 199,
      currency: "EUR",
      quantity: 2,
      sold: 0,
      isVisible: true,
      isFeatured: true,
      deliveryMethod: DeliveryMethod.DIGITAL,
      personalizationStatus: PersonalizationStatus.NOT_REQUIRED,
      includes: ["Pre-pitched 2-person tent", "Sleeping bag & pillow", "Luxury wash facilities", "Private locker", "Complimentary breakfast", "Priority campsite location"],
    },
    {
      name: "Car Camping Pass",
      slug: "car-camping-pass",
      description: "Drive to Awakenings 2026 and camp next to your vehicle. The Car Camping Pass allows you to park and camp in the dedicated car camping area, just a short walk from the festival entrance.",
      category: TicketCategory.CAR_CAMPING,
      dayLabel: "Saturday Night",
      originalPrice: 69.50,
      resalePrice: 95,
      currency: "EUR",
      quantity: 3,
      sold: 0,
      isVisible: true,
      isFeatured: false,
      deliveryMethod: DeliveryMethod.DIGITAL,
      personalizationStatus: PersonalizationStatus.NOT_REQUIRED,
      includes: ["Car parking spot (1 vehicle)", "Camping space adjacent to car", "Campsite facilities access", "Security patrolled area", "Valid for 1 night"],
    },
    {
      name: "Premium Weekend Experience",
      slug: "premium-weekend-experience",
      description: "The ultimate Awakenings Festival 2026 experience. Premium access includes exclusive viewing areas, dedicated entrances, and VIP services across the full weekend. Limited availability.",
      category: TicketCategory.PREMIUM,
      dayLabel: "10–12 July – Premium",
      originalPrice: 299.50,
      resalePrice: 399,
      currency: "EUR",
      quantity: 1,
      sold: 0,
      isVisible: true,
      isFeatured: true,
      deliveryMethod: DeliveryMethod.NAME_CHANGE,
      personalizationStatus: PersonalizationStatus.PENDING,
      includes: ["Full weekend premium access", "Exclusive VIP viewing areas", "Dedicated fast-lane entrance", "VIP bar access", "Complimentary drinks vouchers (4x)", "Premium restroom facilities", "Dedicated cloakroom", "Name personalization service"],
    },
    {
      name: "Saturday VIP",
      slug: "saturday-vip",
      description: "VIP access for Saturday July 11 at Awakenings Festival 2026. Enjoy elevated festival experience with exclusive areas and premium services on the biggest day of the weekend.",
      category: TicketCategory.SATURDAY,
      dayLabel: "Saturday 11 July – VIP",
      originalPrice: 199.50,
      resalePrice: 265,
      currency: "EUR",
      quantity: 2,
      sold: 0,
      isVisible: true,
      isFeatured: false,
      deliveryMethod: DeliveryMethod.NAME_CHANGE,
      personalizationStatus: PersonalizationStatus.PENDING,
      includes: ["Saturday VIP access", "VIP viewing platform access", "Fast-lane entrance", "VIP bar area", "2x complimentary drinks", "Premium restrooms", "Name personalization service"],
    },
    {
      name: "Sunday VIP",
      slug: "sunday-vip",
      description: "VIP access for Sunday July 12 at Awakenings Festival 2026. Close out the festival weekend in style with premium access, exclusive areas, and elevated services.",
      category: TicketCategory.SUNDAY,
      dayLabel: "Sunday 12 July – VIP",
      originalPrice: 199.50,
      resalePrice: 265,
      currency: "EUR",
      quantity: 1,
      sold: 0,
      isVisible: true,
      isFeatured: false,
      deliveryMethod: DeliveryMethod.NAME_CHANGE,
      personalizationStatus: PersonalizationStatus.PENDING,
      includes: ["Sunday VIP access", "VIP viewing platform access", "Fast-lane entrance", "VIP bar area", "2x complimentary drinks", "Premium restrooms", "Name personalization service"],
    },
    {
      name: "Accommodation Package Deluxe",
      slug: "accommodation-package-deluxe",
      description: "The complete luxury Awakenings 2026 package. Full weekend festival access combined with a deluxe on-site accommodation unit. Sleep in comfort, wake up steps from the stages. Ultra-limited availability.",
      category: TicketCategory.ACCOMMODATION,
      dayLabel: "10–12 July – Accommodation",
      originalPrice: 349.50,
      resalePrice: 449,
      currency: "EUR",
      quantity: 1,
      sold: 0,
      isVisible: true,
      isFeatured: true,
      deliveryMethod: DeliveryMethod.NAME_CHANGE,
      personalizationStatus: PersonalizationStatus.PENDING,
      includes: ["Full weekend festival access", "Private luxury accommodation unit", "En-suite bathroom", "Air conditioning", "Queen size bed with premium bedding", "Complimentary breakfast (Sat & Sun)", "Private parking space", "Dedicated concierge service", "Name personalization service"],
    },
    {
      name: "Basic Weekend + Saturday Camping",
      slug: "basic-weekend-saturday-camping",
      description: "Great value Awakenings 2026 package combining full weekend festival access with Saturday night camping. The perfect way to enjoy both days without worrying about transport home after Saturday.",
      category: TicketCategory.WEEKEND,
      dayLabel: "10–12 July + Sat Camping",
      originalPrice: 169.50,
      resalePrice: 230,
      currency: "EUR",
      quantity: 2,
      sold: 0,
      isVisible: true,
      isFeatured: false,
      deliveryMethod: DeliveryMethod.NAME_CHANGE,
      personalizationStatus: PersonalizationStatus.PENDING,
      includes: ["Full weekend access (Sat + Sun)", "Saturday night camping", "Campsite facilities", "Name personalization service", "Digital e-tickets after transfer"],
    },
  ];

  for (const ticket of tickets) {
    await prisma.ticket.create({ data: ticket });
  }

  console.log(`Seeded ${tickets.length} tickets successfully.`);

  // Seed admin user
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;
  if (!adminEmail || !adminPassword) {
    throw new Error("ADMIN_EMAIL and ADMIN_PASSWORD must be set in environment variables");
  }
  const hashedPassword = await hash(adminPassword, 12);

  await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      email: adminEmail,
      name: "Admin",
      password: hashedPassword,
      role: "ADMIN",
    },
  });

  console.log(`Admin user seeded: ${adminEmail}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
