/**
 * DevDigger Premium Button System
 * Gallery-quality interactive elements for sophisticated user experiences
 */

// Core button component
export { PremiumButton } from '../PremiumButton';
export type { 
  PremiumButtonProps,
  ButtonVariant,
  ButtonSize,
  IconPosition,
  ButtonShape
} from '../PremiumButton';

// Button group components
export { 
  ButtonGroup, 
  SegmentedControl, 
  FloatingActionButton, 
  SplitButton 
} from '../ButtonGroup';
export type {
  ButtonGroupProps,
  SegmentedControlProps,
  SegmentedControlOption,
  FloatingActionButtonProps,
  SplitButtonProps
} from '../ButtonGroup';

// Examples and documentation
export { ButtonExamples } from '../ButtonExamples';

// Existing components (legacy support)
export { Button } from '../Button';
export { NeonButton } from '../NeonButton';
export { PowerButton } from '../PowerButton';

/**
 * Quick Usage Examples:
 * 
 * // Primary CTA button
 * <PremiumButton variant="primary" size="large" glow magnetic>
 *   COMMENCE
 * </PremiumButton>
 * 
 * // Secondary action with icon
 * <PremiumButton variant="secondary" icon={<SettingsIcon />}>
 *   Settings
 * </PremiumButton>
 * 
 * // Oracle mystical button
 * <PremiumButton variant="oracle" glow magnetic ripple>
 *   Divine Inspiration
 * </PremiumButton>
 * 
 * // Button group
 * <ButtonGroup variant="connected">
 *   <PremiumButton variant="secondary">First</PremiumButton>
 *   <PremiumButton variant="secondary">Second</PremiumButton>
 * </ButtonGroup>
 * 
 * // Floating action button
 * <FloatingActionButton
 *   position="bottom-right"
 *   variant="primary"
 *   extended
 * >
 *   <AddIcon />
 *   Create New
 * </FloatingActionButton>
 */