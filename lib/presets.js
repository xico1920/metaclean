export const MAX_PRESETS_FREE = 2
export const MAX_PRESETS_PRO  = 10

export async function loadPresets(supabase, userId) {
  const { data, error } = await supabase
    .from('presets')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
  if (error) return []
  return data || []
}

export async function savePreset(supabase, userId, { name, platform, formats }) {
  const { data, error } = await supabase
    .from('presets')
    .insert({ user_id: userId, name: name.trim(), platform, formats: Array.from(formats) })
    .select()
    .single()
  return { data, error }
}

export async function deletePreset(supabase, presetId) {
  const { error } = await supabase
    .from('presets')
    .delete()
    .eq('id', presetId)
  return { error }
}
