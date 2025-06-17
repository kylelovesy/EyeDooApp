import { GROUP_SHOT_CATEGORIES } from '@/types/new/enum';

/**
 * Returns true if custom group details (name, description, members)
 * should be shown based on selected category and subtype.
 *
 * @param category - The selected group shot category key
 * @param subtype - The selected group shot subtype (string)
 */
export function shouldShowGroupDetails(
  category: keyof typeof GROUP_SHOT_CATEGORIES,
  subtype: string
): boolean {
  if (!category || !subtype) return true; // fallback: show fields

  const validSubtypes = GROUP_SHOT_CATEGORIES[category]?.subtypes ?? [];

  // If subtype is not one of the known subtypes, allow custom fields
  return !validSubtypes.includes(subtype);
}


//Example usage:
// const showDetails = shouldShowGroupDetails(formValues.groupShotCategory, formValues.groupShotSubtype);

// {showDetails && (
//   <>
//     <TextInput label="Group Name" {...register('groupName')} />
//     <TextInput label="Description" {...register('groupDescription')} />
//     <MemberPicker label="Group Members" {...register('groupMembers')} />
//   </>
// )}