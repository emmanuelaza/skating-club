import type { LoyaltyType } from '@/types/database';
import type { LoyaltyBalance } from '@/types';

/**
 * Calcula el saldo de puntos a partir de los movimientos. Reemplaza a una vista
 * `loyalty_balance` (que podría materializarse en SQL más adelante).
 */
export function computeLoyaltyBalance(
  profileId: string,
  movements: { type: LoyaltyType; points: number }[],
): LoyaltyBalance {
  let earned = 0;
  let redeemed = 0;
  let balance = 0;
  for (const movement of movements) {
    const points = movement.points;
    switch (movement.type) {
      case 'earned':
        earned += points;
        balance += points;
        break;
      case 'redeemed':
        redeemed += Math.abs(points);
        balance -= Math.abs(points);
        break;
      case 'expired':
        balance -= Math.abs(points);
        break;
      case 'adjusted':
        balance += points;
        if (points >= 0) earned += points;
        else redeemed += Math.abs(points);
        break;
    }
  }
  return { profile_id: profileId, balance, total_earned: earned, total_redeemed: redeemed };
}
