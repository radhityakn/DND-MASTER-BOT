/**
 * DnD Master Bot - Google Sheets Setup Script
 * --------------------------------------------
 * Script ini membuat / merapikan 4 tab (characters, campaigns, scenes, history)
 * dengan urutan kolom yang PERSIS cocok dengan blueprint Make.com.
 *
 * CARA PAKAI:
 * 1. Buka spreadsheet kamu di Google Sheets.
 * 2. Menu: Extensions > Apps Script
 * 3. Hapus kode contoh, lalu PASTE seluruh isi file ini.
 * 4. Klik tombol Run (▶) pada fungsi setupDnDSheets.
 * 5. Izinkan permission saat diminta. Selesai!
 *
 * CATATAN: Script ini hanya menulis/menimpa BARIS HEADER (baris 1).
 * Data lama (baris 2 dst) TIDAK dihapus. Karena ini database trial,
 * disarankan tab dalam keadaan kosong agar tidak ada salah-kolom.
 */
function setupDnDSheets() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();

  var schema = {
    characters: [
      "char_id", "player_id", "campaign_id", "username", "char_name",
      "race", "class", "level", "hp_max", "hp_current", "ac",
      "str", "dex", "con", "int", "wis", "cha",
      "proficiency_bonus", "inventory", "conditions",
      "death_saves_success", "death_saves_fail", "xp_total",
      "background", "alignment", "character_status"
    ],
    campaigns: [
      "campaign_id", "chat_id", "campaign_name", "current_scene_id",
      "combat_active", "round_number", "created_at", "dm_style", "status"
    ],
    scenes: [
      "scene_id", "campaign_id", "scene_name", "location_desc",
      "enemies_json", "key_clues", "dm_notes", "scene_order", "status"
    ],
    history: [
      "timestamp", "campaign_id", "scene_id", "player_id", "username",
      "char_name", "player_message", "dm_response", "dice_rolled", "state_changes"
    ]
  };

  Object.keys(schema).forEach(function (tabName) {
    var headers = schema[tabName];
    var sheet = ss.getSheetByName(tabName);
    if (!sheet) {
      sheet = ss.insertSheet(tabName);
    }
    // Tulis header di baris 1
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
    // Rapikan tampilan header
    sheet.getRange(1, 1, 1, headers.length)
      .setFontWeight("bold")
      .setBackground("#1f6f6f")
      .setFontColor("#ffffff");
    sheet.setFrozenRows(1);
  });

  SpreadsheetApp.getUi().alert(
    "✅ Selesai! 4 tab (characters, campaigns, scenes, history) sudah siap " +
    "dengan kolom yang cocok dengan blueprint."
  );
}
