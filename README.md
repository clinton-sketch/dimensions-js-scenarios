# Dimensions JS scenarios

This repo holds the JavaScript for every scenario in *Scenario List Javascript* that is feasible through JS (scenarios 1 to 84). Each scenario has its own file. Scenario n is sheet row n+1, and its file name starts with R(n+1).

The working copies live with the merged test MDDs in the Drive folder *JS scenarios* (Scenario_01_to_10 ... Scenario_73_to_84), each in a `js_files` folder next to `Test_JS.mdd` and `SurveyTemplate_DA.htm`. This repo is the backup of those `js_files` folders and matches them file for file (last synced 18 Nov 2026).

## How to use

1. **Keep `00_dim-helpers.js` in `js_files`** and load it once at the top of the routing. Every scenario file uses it, so if it is missing none of the scenario JS works.
   ```vb
   IOM.Banners.AddNew("DimJS", "<mrRef RefType = ""script"" src = ""js_files/00_dim-helpers.js"" language = ""javascript""></mrRef>")
   ```
2. **Load the scenario file on its question**, just before the ask, and remove it straight after:
   ```vb
   Q36d.Banners.AddNew("R33_Q36d", "<mrRef RefType = ""script"" src = ""js_files/R33_Q36d_disable_after_three.js"" language = ""javascript""></mrRef>")
   Q36d.Ask()
   Q36d.Banners.Remove("R33_Q36d")
   ```
   For a page or a block, put the banner on its first question: the player does not render a banner set on the page or block itself. No JS goes into the labels or the routing. `make_banner.py` (inline banner) is only a fallback for a quick local test.
3. **The path is relative** (`js_files/<file>.js`), so the MDD, the template and the `js_files` folder can be copied together into any folder and keep working.
4. **Edit the `CFG` block** at the top of each file. It holds the question names, category codes and element ids. Check the real field names with *View Source* on the rendered page:
   - `_Q<Question>`
   - `_Q<Block>_Q<Question>`
   - `_Q<Loop>_Q<Iteration>_Q<Sub>`
   - Category inputs have values such as `_1`.
5. **Keep the server check.** Each header has a **Setup** line (how to declare the questions) and a **Routing** line. The routing validation is still needed, because JS can be switched off or bypassed. Same-page follow-ups need `MustAnswer = False`, `codes({_NA "" NA})` on optional numeric/text boxes, and a validation function, because Dimensions validates every question on the page.

### Hosted links (optional)

If a survey cannot ship a `js_files` folder, jsDelivr serves this repo as real JavaScript:
`https://cdn.jsdelivr.net/gh/clinton-sketch/dimensions-js-scenarios@<commit>/<file>.js`. Pin the link to a commit so a later push never changes a live survey. Google Drive can't serve files to `<script src>`: it returns a virus-scan page or a download that browsers refuse to run.

## Index

### Scenario_01_to_10 (Survey 34)

| Row | Scenario | File |
|---|---|---|
| 2 | Live percentage calculation and totals (S4 + Q2) | R02_S4_Q2_live_percentage_totals.js |
| 3 | Same-page Q3A follow-up, exclusive More/Fewer | R03_Q3_Q3A_same_page_followup_exclusive_rows.js |
| 4 | % box enabled only for selected products (Q10) | R04_Q10_enable_percent_for_selected.js |
| 6 | One open-end line at a time (Q1) | R06_Q1_reveal_one_open_end_line.js |
| 7 | Biosimilar definition pop-up from a link (Q2Bio_Pop) | R07_Q2Bio_Pop_definition_popup.js |
| 8 | S12 selections shown locked in Q3 column A | R08_S12_Q3_lock_piped_current_coverage.js |
| 9 | Live count of selections (Q3Q0b) | R09_Q3Q0b_live_selection_count.js |
| 10 | Group-wise None (S12) | R10_S12_group_wise_none.js |
| 11 | Disable right-click / cut / copy / paste | R11_survey_wide_block_rightclick_copy_paste.js |

### Scenario_11_to_17

| Row | Scenario | File |
|---|---|---|
| 12 | Show Next after the scenario link is clicked (Q4) | R12_Q4_show_next_after_link_click.js |
| 13 | Per-column None + autosum, jQuery (Q6) | R13_Q6_per_column_none_autosum_jquery.js |
| 14 | Most / least appealing grid (Q10) | R14_Q10_most_least_maxdiff_grid.js |
| 15 | Collapsible questions on one page (P1-P3) | R15_P1_P3_collapsible_questions.js |
| 16 | Same-page P5 and live pipe into P6 | R16_P4_P5_P6_same_page_show_and_pipe.js |
| 17 | Row Don't know vs text boxes (Q20) | R17_Q20_row_dont_know_vs_text_boxes.js |
| 18 | Elaborate pop-up under 20 characters (Q22) | R18_Q22_elaborate_popup_under_20_chars.js |

### Scenario_18_to_41

| Row | Scenario | File |
|---|---|---|
| 19 | Numeric entry limited to three digits (Q34a) | R19_Q34a_three_digit_limit.js |
| 20 | Grouped grid headers (Q34b) | R20_Q34b_grouped_grid_headers.js |
| 21 | Running total and remaining (Q34c) | R21_Q34c_running_total_and_remaining.js |
| 22 | Slider with minimum from Q34d (Q34e) | R22_Q34d_Q34e_slider_min_from_previous.js |
| 23 | Grid corner label (Q34f) | R23_Q34f_grid_corner_label.js |
| 24 | Keep desktop grid on mobile (Q35a) | R24_Q35a_keep_desktop_grid_on_mobile.js |
| 25 | Sticky grid header (Q35b) | R25_Q35b_sticky_grid_header.js |
| 26 | Multi-select dropdown (Q35c) | R26_Q35c_multiselect_dropdown.js |
| 27, 28 | Next only after full video / audio playback (Q35d, Q35e) | R27_R28_Q35d_Q35e_media_full_playback_gate.js (Q35e copy: R28_Q35e_audio_full_playback_gate.js) |
| 29 | Grey placeholder for Other (Q35f) | R29_Q35f_grey_placeholder_other.js |
| 30 | Other checkbox only after text (Q36a) | R30_Q36a_other_checkbox_after_text.js |
| 31 | Click image to enlarge (Q36b) | R31_Q36b_click_image_to_enlarge.js |
| 32 | Clickable ranking for selected rows (Q36c) | R32_Q36c_clickable_ranking_selected_rows.js |
| 33 | Disable the rest after 3 selections (Q36d) | R33_Q36d_disable_after_three.js |
| 34 | Live thousands separator (Q37a) | R34_Q37a_thousands_separator_live.js |
| 35 | Show Q37c when Q37b > 50 | R35_Q37b_Q37c_show_when_over_50.js |
| 36 | Column autosum with row None, None header once (Q37d) | R36_Q37d_column_autosum_row_none.js |
| 37 | Auto-advance after 15 seconds (Q37e) | R37_Q37e_auto_advance_15s.js |
| 38 | Different dropdown per row (Q37f) | R38_Q37f_different_dropdown_per_row.js |
| 39 | Purchase auto-selects Read (Q39a) | R39_Q39a_purchase_auto_selects_read.js |
| 40 | Other-specify per column (Q39b) | R40_Q39b_other_specify_per_column.js |
| 41, 42 | Read-only Total column; Physical + Digital = Total (Q39d, Q39f) | R41_R42_Q39d_Q39f_readonly_total_and_row_check.js (Q39f copy: R42_Q39f_readonly_total_and_row_check.js) |

### Scenario_42_to_55 (Survey 38)

| Row | Scenario | File |
|---|---|---|
| 43 | S14 / S14ter rows shown only where needed, totals piped, same page | R43_S13_S14_S14ter_same_page_filter_and_totals.js |
| 44 | Live check: T2D + CKD columns not above the first column (S14ter) | R44_S14ter_b_plus_c_live_check.js |
| 47 | Date of HF diagnosis as mm/yyyy (P3) | R47_P3_month_year_mmyyyy.js |
| 48 | EF fields: % suffix, P4ter only when needed, patient type (P4 / P4ter) | R48_P4_P4ter_ef_percent.js |
| 49 | Comorbidities: None exclusive, Other box only with Other (P5) | R49_P5_none_other_specify.js |
| 50 | SGLT2 specify box and Other box (P11) | R50_P11_sglt2_specify.js |
| 51 | P12 lists only the P11 treatments, with the P11 texts | R51_P12_from_P11_live.js |
| 53 | Products a patient cannot have greyed out (Q6) | R53_Q6_patient_product_cells.js |
| 55 | Replacement list only for "in place of", ARNI ticked (Q7) | R55_Q7_replacement_list.js |

### Scenario_56_to_64 (PC1)

| Row | Scenario | File |
|---|---|---|
| 57 | Instruction video in a player box on the page | R57_Section1_Intro_video_player.js |
| 59 | Avatar tiles and patient code on one screen (PT1 / PT2) | R59_PT1_PT2_avatar_tiles_with_code.js (images: R59_avatar01-10.png) |
| 60, 61 | Diagnosis and last-visit dates as mm/yyyy with live checks (A1_1 / A1_2) | R60_R61_A1_1_A1_2_month_year_checks.js |
| 62 | Type 1 / Type 2 not together, exclusive None (A1_6) | R62_A1_6_comorbidity_rules.js |
| 63 | Other-specify box beside Other (A2_5) | R63_A2_5_other_specify_inline.js |
| 64 | Trajectory radios only for selected symptoms (A3_1) | R64_A3_1_enable_trajectory.js |
| 65 | Count fields only for the matching answer (A3_4) | R65_A3_4_show_count.js |

### Scenario_65_to_72 (PC2)

| Row | Scenario | File |
|---|---|---|
| 66 | Running total with live mismatch against S9_1 (S10) | R66_S10_running_total.js |
| 68 | Section 1 video in a player box on the page | R68_Section1_Video_player.js |
| 69 | Unique avatar selector with patient descriptor (P0) | R69_P0_unique_avatar_tiles_with_descriptor.js |
| 70 | Migraine days checked against the patient type (A4) | R70_A4_type_band_check.js |
| 71 | Other-specify boxes beside their answers (PRF) | R71_PRF_other_specify_inline.js |
| 73 | Duration in weeks / months / years, Unknown exclusive (A10) | R73_A10_duration_unknown.js |

### Scenario_73_to_84 (PC3)

| Row | Scenario | File |
|---|---|---|
| 74 | S14 / S14ter rows shown only where needed, totals piped, same page | R74_S13_S14_S14ter_same_page_filter_and_totals.js |
| 77 | Date of HF diagnosis as mm/yyyy, capped at the completion month (P3) | R77_P3_month_year_mmyyyy.js |
| 78 | EF fields: % suffix, P4ter only when needed, patient type | R78_P4_P4ter_ef_percent.js |
| 79 | Comorbidities: None exclusive, Other box only with Other (P5) | R79_P5_none_other_specify.js |
| 80 | SGLT2 specify box (live against EF) and Other box (P11) | R80_P11_sglt2_other_specify.js |
| 81 | P12 lists only the P11 treatments, with the P11 texts | R81_P12_from_P11_live.js |
| 83 | Products a patient cannot have greyed out (Q6) | R83_Q6_patient_product_cells.js |
| 84 | Replacement list only for "in place of" (Q7) | R84_Q7_replacement_list.js |
| 85 | ARNI ticked automatically when selected in P11 (Q7) | R85_Q7_arni_preselect.js |

## Not in this repo

The media files that sit in the Drive `js_files` folders (R57/R68 stand-in videos, R69 avatar images) are kept only on Drive.

## Known limits

- **Row 11:** blocking copy and paste is best effort only. It can't stop screenshots, developer tools or a browser with JS switched off.
- **Rows 57 and 68:** the videos are stand-ins. Replace them with the client's real video.
- **Open client questions:** codes and rules that the sheet says need confirming are marked "confirm" in the file headers.
