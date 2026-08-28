import { BannersManager } from "@/components/admin/banners-manager";
import { adminGetBanners } from "@/lib/data";

export const dynamic = "force-dynamic";

type RawBanner = {
  id: string;
  title: string;
  subtitle: string | null;
  image_url: string | null;
  button_text: string | null;
  button_url: string | null;
  variant: string;
  is_active: boolean;
  sort_order: number;
};

export default async function AdminBannersPage() {
  const banners = (await adminGetBanners()) as RawBanner[];
  return (
    <BannersManager
      banners={banners.map((b) => ({
        id: b.id,
        title: b.title,
        subtitle: b.subtitle,
        imageUrl: b.image_url,
        buttonText: b.button_text,
        buttonUrl: b.button_url,
        variant: b.variant,
        isActive: b.is_active,
        sortOrder: b.sort_order,
      }))}
    />
  );
}
