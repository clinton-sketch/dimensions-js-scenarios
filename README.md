# Dimensions JS scenarios

This folder has JavaScript for every scenario left blank in column F of *Scenario List Javascript* (feasible through JS). There's one file per scenario. Where Survey 38 and PC3 share a scenario, one file covers both rows.

## How to use

1. **Load the helper once** at the top of routing, before the first ask, from its hosted link. Every file uses it:
   ```vb
   IOM.Banners.AddNew("DimJS", "<script type=""text/javascript"" src=""<link to 00_dim-helpers.js>""></script>")
   ```
2. **Load the scenario file on its question** from its hosted link, just before the ask, and remove it straight after:
   ```vb
   Q36d.Banners.AddNew("R33_Q36d", "<script type=""text/javascript"" src=""<link to R33 file>""></script>")
   Q36d.Ask()
   Q36d.Banners.Remove("R33_Q36d")
   ```
   No JS goes into the labels or the routing. `make_banner.py` (inline banner) is only a fallback for a quick local test.
3. **Edit the `CFG` block** at the top of each file. It holds the question names, category codes and element ids. The defaults follow the survey documents. Check the real field names with *View Source* on the rendered page:
   - `_Q<Question>`
   - `_Q<Block>_Q<Question>`
   - `_Q<Loop>_Q<Iteration>_Q<Sub>`
   - Category inputs have values such as `_1`.
4. **Keep the server check.** Each header has a **Setup** line (how to declare the questions) and a **Routing** line. The routing validation is still needed, because JS can be switched off or bypassed. Same-screen follow-ups need `MustAnswer = False` plus a validation function, because Dimensions validates every question on the page.

## Test MDD

`Downloads\JS_Scenarios_Dimensions.mdd` holds one question set per scenario below. It was built from the unicom-survey-programming skill (`C:\MyWork\Dimensions_Skills_20261021`) and has only Metadata and Web routing (no Paper section).

No JS is written into the labels or the routing. Each scenario question loads its file from the Drive folder *Dimensions_JS_Scenarios* with `<script src="https://drive.google.com/uc?export=download&id=...">`. The banner is added on that question just before `.Ask()` and removed straight after, the same pattern as BLK2/QY3 in UK260057320101.mdd. The helper and the copy/paste block stay on `IOM.Banners` for the whole survey.

The routing compiles in the local Dimensions interview engine. Question names match the `CFG` defaults, except Q3F (the formulary Q3) and Q6PRF (Survey 38's Q6). Two files have their own copy with different settings: `R28_Q35e_audio_full_playback_gate.js` and `R42_Q39f_readonly_total_and_row_check.js`.

**The Drive files must be shared as "Anyone with the link"**, or respondents' browsers can't load them. For fieldwork, host the files on the survey image server as the example MDD does, and swap the links.

## Index

| Sheet row(s) | Scenario | File |
|---|---|---|
| 2 | Live percentage calculation and totals (S4 + Q2) | R02_S4_Q2_live_percentage_totals.js |
| 3 | Same-page Q3A follow-up, exclusive More/Fewer | R03_Q3_Q3A_same_page_followup_exclusive_rows.js |
| 4 | % box enabled only for selected products (Q10) | R04_Q10_enable_percent_for_selected.js |
| 6 | One open-end line at a time (Q1) | R06_Q1_reveal_one_open_end_line.js |
| 8 | S12 selections shown locked in Q3 column A | R08_S12_Q3_lock_piped_current_coverage.js |
| 9 | Live count of selections (Q3Q0b) | R09_Q3Q0b_live_selection_count.js |
| 10 | Group-wise None (S12) | R10_S12_group_wise_none.js |
| 11 | Disable right-click / cut / copy / paste | R11_survey_wide_block_rightclick_copy_paste.js |
| 12 | Show Next after the scenario link is clicked (Q4) | R12_Q4_show_next_after_link_click.js |
| 13 | Per-column None + autosum, jQuery (Q6) | R13_Q6_per_column_none_autosum_jquery.js |
| 14 | Most / least appealing grid (Q10) | R14_Q10_most_least_maxdiff_grid.js |
| 15 | Collapsible questions on one page (P1-P3) | R15_P1_P3_collapsible_questions.js |
| 16 | Same-page P5 and live pipe into P6 | R16_P4_P5_P6_same_page_show_and_pipe.js |
| 17 | Row Don't know vs text boxes (Q20) | R17_Q20_row_dont_know_vs_text_boxes.js |
| 18 | Elaborate pop-up under 20 characters (Q22) | R18_Q22_elaborate_popup_under_20_chars.js |
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
| 36 | Column autosum with row None (Q37d) | R36_Q37d_column_autosum_row_none.js |
| 37 | Auto-advance after 15 seconds (Q37e) | R37_Q37e_auto_advance_15s.js |
| 38 | Different dropdown per row (Q37f) | R38_Q37f_different_dropdown_per_row.js |
| 39 | Purchase auto-selects Read (Q39a) | R39_Q39a_purchase_auto_selects_read.js |
| 40 | Other-specify per column (Q39b) | R40_Q39b_other_specify_per_column.js |
| 41, 42 | Read-only Total column; Physical + Digital = Total (Q39d, Q39f) | R41_R42_Q39d_Q39f_readonly_total_and_row_check.js (Q39f copy: R42_Q39f_readonly_total_and_row_check.js) |
| 44 | Live B + C <= A (S14ter) | R44_S14ter_live_B_plus_C_le_A.js |
| 47, 77 | mm/yyyy capped at completion date (P3) | R47_R77_P3_month_year_max_completion.js |
| 48, 78 | P4ter shown for P4bis = Yes, % suffix, EF band | R48_R78_P4bis_P4ter_EF_show_and_percent.js |
| 50, 80 | SGLT2 specify boxes (P11 / P12) | R50_R80_P11_P12_SGLT2_specify.js |
| 51, 81 | P12 shows only P11 codes, same page | R51_R81_P11_to_P12_same_page_filter.js |
| 55, 84 | Q7 replacement list inside the patient row | R55_R84_Q7_replacement_list_in_row.js |
| 59 | Avatar picker with code box (PT1 / PT2) | R59_PT1_PT2_avatar_picker_with_code.js |
| 60, 61 | Diagnosis and last-visit month/year checks (A1_1 / A1_2) | R60_R61_A1_1_A1_2_diagnosis_and_visit_dates.js |
| 62 | Type 1 vs Type 2 exclusion, None, specify boxes (A1_6) | R62_A1_6_pairwise_exclusion_and_none.js |
| 64 | Trajectory radios only for selected rows (A3_1) | R64_A3_1_enable_trajectory_for_selected_rows.js |
| 65 | Conditional count fields (A3_4) | R65_A3_4_conditional_count_fields.js |
| 66 | Running total vs S9_1 (S10) | R66_S10_running_total_vs_S9_1.js |
| 71 | Other-specify show/hide (A2/A3/A7/A9/A11/A12) | R71_PRF_other_specify_show_hide.js |
| 73 | Duration vs Unknown (A10) | R73_A10_duration_vs_unknown.js |

## Known limits

- **Row 11:** blocking copy and paste is best effort only. It can't stop screenshots, developer tools or a browser with JS switched off.
- **Rows 27 and 28:** need the real video/audio files hosted where respondents can reach them.
- **Rows 59 to 73 (PC1 / PC2):** written from the notes in the sheet, because the PC documents were not available. Check the codes in `CFG` against them.
- **Open client questions:** codes and rules that the sheet says need confirming are marked "confirm" in the file headers. These are the S12 codes, the SGLT2 "EXCEPT IF" rule, A34b, A9 and the date ranges.
