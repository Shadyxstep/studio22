import type { GiftVouchers } from "@/lib/content/schema";

export const GIFT_VOUCHERS_PATH = "/gift-vouchers";

type Group = GiftVouchers["groups"][number];

/** Cheapest voucher in a group, or across every group. */
export function lowestPrice(groups: readonly Group[]): number {
  return Math.min(...groups.flatMap((g) => g.vouchers.map((v) => v.price)));
}

/** "From {price}" for a group with several vouchers; the plain price for one. */
export function groupPrice(template: string, group: Group): string {
  const price = `€${lowestPrice([group])}`;
  return group.vouchers.length > 1 ? template.replace("{price}", price) : price;
}

export function voucherCtaId(voucher: { id: string }): string {
  return `buy_voucher_${voucher.id.replace(/-/g, "_")}`;
}
