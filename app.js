/* ============================================================
   FitPulse — app.js  (商用クオリティ・完成版)
   - 🍱 食事ログの朝・昼・夕・間食グループ分け表示
   - 📅 過去日付の運動・食事入力機能
   - 📱 PWAインストールバナー表示サポート
   - 🍄 超絶拡充 食材DB（居酒屋・魚介・練り物・調味料・プロテイン飲料・ナッツ・果物全網羅）
   - ⚡ 目標PFC設定のスマート相互連動計算 (カロリー+2項目 ➔ 残り1項目を自動補完)
   - 🌿 食物繊維（Fib）およびビタミン関連データのビジュアルプログレス
   - ベースブレッド公式全8種 栄養成分完全修正版（2026最新公式数値）
   - 初回プロファイル入力（未設定時にダイアログ自動表示）
   - 種目DB（筋トレ250+種目 + 有酸素運動）
   - ⚡ 前回値の1タップコピー機能
   - 📈 週平均・月平均体重トレンド算出
   - リアルタイム カロリー収支（代謝 - 摂取 = ＋/ー表示）
   - 有酸素機能（傾斜・速度・時間 ➔ 自動カロリー計算）
   - 食事の一括連続入力（バッチ登録）
   - タイマー（筋トレ/運動タブ）
   - カレンダー機能（タップで詳細表示）
   ============================================================ */
'use strict';

// ─── Storage Keys ───────────────────────────────────────────
const LS = { WORKOUTS:'fp_workouts', MEALS:'fp_meals', INBODY:'fp_inbody', PROFILE:'fp_profile', CUSTOM_EX:'fp_custom_ex' };

// ─── FOOD DATABASE ───────────────────────────────────────────
const FOOD_DB_RAW = [
  // 🍞 ベースブレッド全種
  ['ベースブレッド プレーン',250.0,16.9,8.8,28.1,[['1袋(80g)',80]],4.0],
  ['ベースブレッド チョコレート',332.5,17.0,11.4,44.3,[['1袋(80g)',80]],4.1],
  ['ベースブレッド メープル',313.8,16.9,10.8,41.5,[['1袋/2個(80g)',80]],4.1],
  ['ベースブレッド シナモン',325.0,17.0,11.8,33.9,[['1袋/2個(80g)',80]],4.1],
  ['ベースブレッド カレー',338.8,17.0,10.4,37.5,[['1袋(80g)',80]],4.1],
  ['ベースブレッド ミニ食パン プレーン',286.3,16.9,8.9,37.8,[['1袋/2枚(80g)',80]],4.0],
  ['ベースブレッド ミニ食パン レーズン',351.3,16.9,9.3,47.6,[['1袋/2枚(80g)',80]],4.0],
  ['ベースブレッド リッチ',276.3,16.9,9.0,33.0,[['1袋(80g)',80]],4.2],

  // 🍄 キノコ類
  ['ぶなしめじ（生/茹で）',26,2.7,0.5,5.4,[['1パック(100g)',100],['1/2パック(50g)',50]],3.7],
  ['えのきたけ（生/茹で）',34,2.8,0.2,7.6,[['1袋(100g)',100],['1/2袋(50g)',50]],3.9],
  ['まいたけ（生/茹で）',24,2.0,0.5,5.0,[['1パック(100g)',100]],3.5],
  ['エリンギ（生/茹で）',31,2.9,0.4,6.6,[['1本(40g)',40],['1パック(100g)',100]],4.3],
  ['しいたけ（生）',25,3.1,0.4,4.9,[['2個(30g)',30],['1パック(100g)',100]],3.5],

  // 🥦 野菜類
  ['キャベツ（生）',23,1.3,0.2,5.2,[['葉1枚(50g)',50],['千切り1杯(70g)',70],['1/4玉(300g)',300]],1.8],
  ['レタス（生）',11,0.6,0.1,2.8,[['葉2枚(50g)',50],['1玉(300g)',300]],1.1],
  ['ブロッコリー（茹で）',27,3.9,0.4,3.8,[['1株(200g)',200],['小鉢(50g)',50]],4.3],
  ['トマト（生）',20,0.7,0.1,4.7,[['M1個(150g)',150],['ミニトマト5個(75g)',75]],1.0],
  ['きゅうり（生）',13,1.0,0.1,3.0,[['1本(100g)',100]],1.1],
  ['玉ねぎ（生）',33,1.0,0.1,8.4,[['1/2個(100g)',100],['1個(200g)',200]],1.5],
  ['ほうれん草（茹で）',18,2.6,0.5,3.1,[['1株/小鉢(80g)',80],['1束(200g)',200]],2.8],
  ['もやし（緑豆/茹で）',15,1.7,0.1,2.6,[['1袋(200g)',200]],1.3],
  ['にんじん（生）',35,0.7,0.2,8.7,[['1/2本(75g)',75],['1本(150g)',150]],2.8],
  ['大根（生）',15,0.5,0.1,4.1,[['輪切り1個(100g)',100]],1.4],
  ['長ネギ（生）',28,1.4,0.1,7.0,[['1本(100g)',100]],2.2],
  ['アボカド',187,2.5,18.7,6.2,[['1個(皮なし140g)',140],['1/2個(70g)',70]],5.3],
  ['かぼちゃ（茹で）',83,1.9,0.3,20.6,[['小鉢(80g)',80]],2.8],
  ['さつまいも（蒸し）',140,1.2,0.3,34.5,[['1本(200g)',200]],3.8],

  // 🫘 こんにゃく・海藻・大豆
  ['板こんにゃく',6,0.1,0,2.3,[['1丁/1枚(250g)',250],['1/2枚(125g)',125]],2.2],
  ['しらたき（糸こんにゃく）',7,0.2,0,2.9,[['1袋(200g)',200]],2.9],
  ['納豆',200,16.5,10.0,12.1,[['1パック(45g)',45],['1パック(50g)',50]],6.7],
  ['キムチ',46,3.2,0.5,7.9,[['小鉢(50g)',50]],2.5],
  ['カットわかめ（水戻し）',12,1.2,0.2,2.0,[['小鉢(50g)',50]],1.8],
  ['めかぶ（味付けなし）',11,0.9,0.4,2.6,[['1パック(40g)',40]],3.4],
  ['もずく（酢なし）',6,0.3,0.2,2.0,[['1パック(60g)',60]],1.4],
  ['木綿豆腐',73,7.0,4.9,1.5,[['1丁(300g)',300],['1/2丁(150g)',150]],0.4],
  ['絹豆腐',56,5.3,3.5,2.0,[['1丁(300g)',300],['1パック(150g)',150]],0.3],
  ['厚揚げ',150,10.7,11.3,0.9,[['1枚(150g)',150]],0.8],
  ['枝豆（茹で/皮なし）',134,11.7,6.2,8.9,[['小鉢(70g)',70]],5.0],

  // 🥑 油脂類・調味料・タレ
  ['オリーブオイル',921,0,100,0,[['大さじ1(12g)',12],['小さじ1(4g)',4]],0],
  ['ごま油',921,0,100,0,[['大さじ1(12g)',12],['小さじ1(4g)',4]],0],
  ['サラダ油',921,0,100,0,[['大さじ1(12g)',12],['小さじ1(4g)',4]],0],
  ['MCTオイル',900,0,100,0,[['小さじ1(5g)',5],['大さじ1(15g)',15]],0],
  ['無塩バター',745,0.6,83.0,0.2,[['10g',10],['大さじ1(12g)',12]],0],
  ['マヨネーズ（普通）',703,1.5,76.0,4.5,[['大さじ1(15g)',15],['小さじ1(5g)',5]],0],
  ['マヨネーズ（カロリーハーフ）',316,0.8,31.0,9.0,[['大さじ1(15g)',15]],0],
  ['濃口醤油',71,7.7,0,10.1,[['大さじ1(18g)',18],['小さじ1(6g)',6]],0],
  ['ぽん酢（味ぽん）',63,2.0,0,12.0,[['大さじ1(15g)',15]],0],
  ['めんつゆ（3倍濃縮）',86,3.6,0,16.5,[['大さじ1(15g)',15]],0],
  ['焼肉のタレ',130,2.5,0.8,27.0,[['大さじ1(18g)',18]],0],
  ['味噌（合わせ）',217,12.0,6.0,24.0,[['大さじ1(18g)',18]],4.0],
  ['ケチャップ',119,1.6,0.2,27.5,[['大さじ1(15g)',15]],1.5],

  // 🥚 卵・乳製品・プロテイン飲料
  ['鶏卵（全卵）',151,12.3,10.3,0.3,[['M1個(約50g)',50],['L1個(約60g)',60],['2個(100g)',100]],0],
  ['ゆで卵',151,12.9,10.0,0.3,[['1個(50g)',50],['2個(100g)',100]],0],
  ['目玉焼き',180,12.0,14.0,0.3,[['1個(50g)',50]],0],
  ['卵白',44,10.5,0,0.5,[['1個分(30g)',30]],0],
  ['牛乳（普通）',67,3.3,3.8,4.8,[['コップ1杯(200ml)',200],['1パック(1000ml)',1000]],0],
  ['低脂肪乳',46,3.8,1.0,5.5,[['コップ1杯(200ml)',200]],0],
  ['無調整豆乳',46,3.6,2.0,3.1,[['1パック(200ml)',200]],0.4],
  ['ギリシャヨーグルト（無糖）',110,10.0,5.0,6.0,[['1個(100g)',100]],0],
  ['プロテインヨーグルト(パルテノ)',100,10.2,4.3,4.8,[['1個(100g)',100]],0],
  ['ザバス ミルクプロテイン (200ml)',51,7.5,0,5.2,[['1本(200ml)',200]],0],
  ['ザバス ミルクプロテイン (430ml)',40,7.0,0,3.1,[['1本(430ml)',430]],0],

  // 🥛 プロテイン（粉・バー）
  ['ホエイプロテイン（粉）',380,75.0,7.0,10.0,[['1食分(30g)',30],['スプーン1杯(10g)',10]],0],
  ['カゼインプロテイン（粉）',370,78.0,5.0,8.0,[['1食分(30g)',30]],0],
  ['ソイプロテイン（粉）',360,80.0,4.0,9.0,[['1食分(30g)',30]],0],
  ['プロテインバー（標準）',350,20.0,10.0,40.0,[['1本(45g)',45]],1.5],
  ['inバー プロテイン バニラ',440,22.0,22.0,38.0,[['1本(44g)',44]],0.5],

  // 🍚 主食・炭水化物
  ['白米（炊飯）',168,2.5,0.3,37.1,[['お茶碗1杯(150g)',150],['大盛り(200g)',200],['少なめ(100g)',100],['1合(330g)',330]],0.5],
  ['玄米（炊飯）',165,2.8,1.0,35.6,[['お茶碗1杯(150g)',150],['200g',200]],1.4],
  ['パックご飯（白米）',168,2.5,0.3,37.1,[['1パック(200g)',200],['1パック(150g)',150]],0.5],
  ['食パン',248,8.9,4.1,46.7,[['6枚切り1枚(60g)',60],['5枚切り1枚(75g)',75]],2.3],
  ['オートミール',380,13.7,5.7,69.1,[['1食(30g)',30],['1食(40g)',40],['1食(50g)',50]],9.4],
  ['うどん（茹で）',105,2.6,0.4,21.6,[['1玉(200g)',200]],0.8],
  ['そば（茹で）',132,4.8,1.0,26.0,[['1玉(200g)',200]],1.5],
  ['スパゲッティ（茹で）',149,5.8,0.9,30.3,[['1食(250g)',250],['大盛り(350g)',350]],1.5],
  ['おにぎり（鮭）',170,4.5,1.0,36.0,[['1個(110g)',110]],0.5],
  ['おにぎり（ツナマヨ）',220,4.0,7.5,33.0,[['1個(110g)',110]],0.5],
  ['おにぎり（昆布/梅）',160,3.0,0.5,36.0,[['1個(110g)',110]],0.5],
  ['ベーグル（プレーン）',245,9.5,1.2,48.0,[['1個(90g)',90]],2.5],

  // 🥩 肉類・居酒屋メニュー・加工肉
  ['サラダチキン（プレーン）',105,23.8,0.9,0.2,[['1パック(110g)',110],['1/2パック(55g)',55]],0],
  ['サラダチキン（ハーブ）',108,23.0,1.2,0.5,[['1パック(110g)',110]],0],
  ['鶏むね肉（皮なし）',116,23.3,1.9,0,[['1枚(250g)',250],['100g',100]],0],
  ['鶏むね肉（皮あり）',145,21.3,5.9,0.1,[['1枚(300g)',300]],0],
  ['鶏もも肉（皮なし）',127,19.0,5.0,0,[['1枚(250g)',250]],0],
  ['鶏もも肉（皮あり）',190,17.3,13.0,0,[['1枚(250g)',250]],0],
  ['鶏ささみ',105,23.9,0.8,0,[['1本(50g)',50],['2本(100g)',100]],0],
  ['鶏レバー（生/加熱）',111,18.9,3.1,0.6,[['1串(50g)',50],['100g',100]],0],
  ['焼き鳥（もも/塩）',160,16.0,9.0,0.2,[['1串(40g)',40],['2串(80g)',80]],0],
  ['焼き鳥（もも/タレ）',185,15.0,8.5,7.0,[['1串(45g)',45]],0],
  ['牛もも肉（赤身）',140,21.3,4.9,0.3,[['ステーキ1枚(150g)',150]],0],
  ['豚もも肉（赤身）',119,22.1,3.0,0.2,[['100g',100]],0],
  ['豚ロース',248,19.3,17.2,0.2,[['1枚(100g)',100]],0],
  ['豚バラ',395,14.4,35.4,0.1,[['100g',100]],0],
  ['ウインナー',321,11.5,28.5,3.3,[['1本(20g)',20],['3本(60g)',60]],0],
  ['ロースハム',196,16.5,13.8,1.5,[['1枚(15g)',15],['4枚(60g)',60]],0],
  ['ベーコン',405,12.9,39.1,0.3,[['1枚(15g)',15]],0],
  ['ビーフジャーキー',315,54.0,7.0,8.0,[['1袋(30g)',30]],0],

  // 🐟 魚介類・練り物
  ['鮭（生/焼き）',133,22.3,4.1,0.1,[['1切れ(80g)',80]],0],
  ['ツナ缶（水煮）',71,16.0,0.7,0.1,[['1缶(70g)',70]],0],
  ['ツナ缶（油漬）',267,18.8,21.7,0.1,[['1缶(70g)',70]],0],
  ['さば缶（水煮）',174,20.9,10.7,0.2,[['1缶(190g)',190],['1/2缶(95g)',95]],0],
  ['さば味噌煮（缶）',210,16.3,13.9,6.6,[['1缶(190g)',190]],0],
  ['まぐろ赤身（刺身）',125,26.4,1.4,0.1,[['1冊(150g)',150],['5貫(75g)',75]],0],
  ['かつお（刺身/たたき）',114,25.8,0.5,0.2,[['1食(100g)',100]],0],
  ['ボイルエビ',91,19.6,0.7,0.3,[['5尾(50g)',50]],0],
  ['ゆでタコ',99,21.7,0.7,0.1,[['1人前(80g)',80]],0],
  ['ボイルイカ',88,18.1,0.8,0.2,[['1人前(100g)',100]],0],
  ['ちくわ',121,12.2,2.0,13.5,[['1本(30g)',30]],0],
  ['カニカマ',89,12.1,0.4,9.2,[['4本(50g)',50]],0],

  // 🥜 ナッツ・間食・お酒
  ['素焼きアーモンド',598,19.6,51.8,19.7,[['10粒(12g)',12],['20粒(24g)',24]],10.1],
  ['ミックスナッツ',620,17.0,55.0,18.0,[['1袋(25g)',25],['一ツカミ(15g)',15]],7.0],
  ['くるみ（生/素焼き）',674,14.6,68.8,11.7,[['5粒(15g)',15]],7.5],
  ['高カカオチョコ (70%)',560,9.0,41.0,42.0,[['1枚/個(5g)',5],['3個(15g)',15]],10.0],
  ['大福（赤飯/草大福）',242,4.5,0.6,55.0,[['1個(100g)',100]],2.0],
  ['ハイボール（350ml）',48,0,0,0.1,[['1缶(350ml)',350]],0],
  ['こだわり酒場のレモンサワー',42,0,0,1.2,[['1缶(350ml)',350]],0],
  ['ビール（淡麗/一番搾り等）',42,0.4,0,3.1,[['350ml缶',350]],0],
  ['ブラックコーヒー（無糖）',4,0.2,0,0.7,[['1杯(200ml)',200]],0],

  // 🍎 果物
  ['バナナ',86,1.1,0.2,22.5,[['1本(皮なし90g)',90]],1.1],
  ['りんご',61,0.2,0.2,16.2,[['1個(250g)',250],['1/2個(125g)',125]],1.4],
  ['キウイフルーツ',56,1.0,0.1,13.5,[['1個(80g)',80]],2.5],
  ['みかん',45,0.7,0.1,11.5,[['1個(80g)',80]],1.0],
  ['冷凍ブルーベリー',49,0.5,0.1,12.9,[['1カップ(100g)',100]],3.3]
];

const FOOD_DB = FOOD_DB_RAW.map(([name,cal,p,f,c,units,fib]) => ({
  name, cal, p, f, c, units: units || [], fib: fib || 0
}));

// ─── EXERCISE DATABASE ─────────────────────────────────────────
const EX_DB = {
  'バーベル': {
    '胸':  ['ベンチプレス','インクラインベンチプレス','デクラインベンチプレス','ナローグリップベンチプレス','ギロチンプレス','フロアプレス','バーベルプルオーバー','リバースグリップベンチプレス'],
    '背中':['デッドリフト','バーベルベントオーバーロウ','ペンレイロウ','Tバーロウ','ルーマニアンデッドリフト','ストレートレッグデッドリフト','バーベルシュラッグ','ラックプル (ハーフDL)','バーベルプルオーバー','スモウデッドリフト'],
    '脚':  ['バーベルバックスクワット','フロントスクワット','ハイバースクワット','ローバースクワット','ゼッチャースクワット','バーベルランジ','バーベルブルガリアンスプリット','バーベルヒップスラスト','グッドモーニング','バーベルカーフレイズ','ボックススクワット'],
    '肩':  ['オーバーヘッドプレス (OHP)','ミリタリープレス','バーベルショルダープレス','ビハインドネックプレス','バーベルアップライトロウ','バーベルシュラッグ','プッシュプレス','バーベルフロントレイズ'],
    '腕':  ['バーベルカール','EZバーカール','リバースカール','21カール','クローズグリップベンチプレス','ライイングトライセプスエクステンション (スカルクラッシャー)','JMプレス','バーベルリストカール','バーベルリバースリストカール'],
    '腹筋':['バーベルロールアウト','バーベルサイドベンド']
  },
  'スミスマシン': {
    '胸':  ['スミスベンチプレス','スミスインクラインベンチプレス','スミスデクラインベンチプレス','スミスナローベンチプレス','スミスリバースグリップベンチプレス','スミスギロチンプレス'],
    '背中':['スミスベントオーバーロウ','スミスシュラッグ','スミスインバーテッドロウ (斜め懸垂)','スミスルーマニアンデッドリフト','スミスラックプル'],
    '脚':  ['スミスフルスクワット','スミスハーフスクワット','スミスフロントスクワット','スミスブルガリアンスプリットスクワット','スミスリバースランジ','スミスシシースクワット','スミスカーフレイズ','スミスヒップスラスト','スミスグッドモーニング'],
    '肩':  ['スミスショルダープレス','スミスビハインドネックプレス','スミスアップライトロウ','スミスシュラッグ','スミスフロントレイズ'],
    '腕':  ['スミスバーベルカール','スミスクローズグリップベンチプレス','スミスJMプレス','スミスドラッグカール'],
    '腹筋':['スミスクランチ','スミスサイドベンド']
  },
  'ダンベル': {
    '胸':  ['ダンベルベンチプレス','ダンベルインクラインプレス','ダンベルデクラインプレス','ダンベルフライ','ダンベルインクラインフライ','ダンベルデクラインフライ','ダンベルプルオーバー','ダンベルパームプレス (Squeeze Press)'],
    '背中':['ダンベルワンハンドロウ','ダンベルベントオーバーロウ','ダンベルデッドリフト','ダンベルルーマニアンデッドリフト','ダンベルシュラッグ','インクラインダンベルロウ','ダンベルシールロウ','ダンベルYレイズ'],
    '脚':  ['ダンベルスクワット','ダンベルゴブレットスクワット','ダンベルランジ','ダンベルブルガリアンスプリットスクワット','ダンベルスティフレッグデッドリフト','ダンベルヒップスラスト','ダンベルスタンディングカーフレイズ','ダンベルステップアップ'],
    '肩':  ['ダンベルショルダープレス','アーノルドプレス','ダンベルサイドレイズ','インクラインサイドレイズ','ダンベルフロントレイズ','ダンベルリアデルトフライ','ライイングリアデルトフライ','ダンベルアップライトロウ','ダンベルシュラッグ'],
    '腕':  ['ダンベルカール','インクラインダンベルカール','ハンマーカール','コンセントレーションカール','プリーチャーダンベルカール','スパイダーカール','ダンベルオーバーヘッドトライセプスエクステンション','ダンベルキックバック','ダンベルリストカール','ダンベルリバースリストカール'],
    '腹筋':['ダンベルクランチ','ダンベルサイドベンド','ダンベルロシアンツイスト']
  },
  'マシン': {
    '胸':  ['チェストプレスマシン','インクラインチェストプレスマシン','ペックデックフライ','ケーブルクロスオーバー (高位)','ケーブルクロスオーバー (中位)','ケーブルクロスオーバー (低位)','ディップスマシン'],
    '背中':['ラットプルダウン (フロント・ワイド)','ラットプルダウン (ナローパラレル)','ラットプルダウン (リバース)','シーテッドローイング (ワイド)','シーテッドローイング (ナロー)','ケーブルローイング','アシストプルアップ (懸垂マシン)','バックエクステンションマシン','リバースフライマシン','ケーブルハイロウ','ケーブルストレートアームプルダウン'],
    '脚':  ['45度レッグプレス','ホリゾンタルレッグプレス','ライイングレッグカール','シーテッドレッグカール','レッグエクステンション','アブダクション (外転)','アダクション (内転)','スタンディングカーフレイズマシン','シーテッドカーフレイズマシン','ヒップスラストマシン','ハックスクワットマシン','Vスクワットマシン'],
    '肩':  ['ショルダープレスマシン','サイドレイズマシン','リアデルトマシン','ケーブルサイドレイズ','ケーブルフロントレイズ','ケーブルフェイスプル','ケーブルアップライトロウ'],
    '腕':  ['バイセップカールマシン','ケーブルバイセップカール','ケーブルハンマーカール (ロープ)','トライセプスマシン','ケーブルトライセプスプッシュダウン (ストレートバー)','ケーブルトライセプスプッシュダウン (ロープ)','ケーブルオーバーヘッドトライセプスエクステンション'],
    '腹筋':['アブドミナルクランチマシン','トーソローテーションマシン','ケーブルクランチ (ロープ)']
  },
  '自重': {
    '胸':  ['プッシュアップ (腕立て伏せ)','ワイドプッシュアップ','ナロー/ダイヤモンドプッシュアップ','インクラインプッシュアップ','デクラインプッシュアップ','アーチャープッシュアップ','クラッププッシュアップ','ディップス (自重)'],
    '背中':['懸垂 (プルアップ・順手ワイド)','懸垂 (チンアップ・逆手)','懸垂 (ニュートラルグリップ)','インバーテッドロウ (斜め懸垂)','スーパーマン','バックエクステンション (自重)','タオルラットプルダウン'],
    '脚':  ['エアスクワット (自重)','ジャンプスクワット','ピストルスクワット (片足スクワット)','ブルガリアンスプリットスクワット (自重)','フォワードランジ','バックランジ','ウォーキングランジ','グルートブリッジ','ヒップスラスト (自重)','ノルディックハムストリングカール','カーフレイズ (自重)','シシースクワット (自重)'],
    '肩':  ['パイクプッシュアップ','ハンドスタンドプッシュアップ (倒立腕立て)','ディクラインパイクプッシュアップ','ショルダータップ'],
    '腕':  ['ベンチディップス','ナロープッシュアップ','ボディウェイトトライセプスエクステンション'],
    '腹筋':['クランチ','シットアップ','リバースクランチ','レッグレイズ (床)','ハンギングレッグレイズ','ハンギングニーレイズ','プランク','サイドプランク','アブローラー (膝つき)','アブローラー (立ちコロ)','マウンテンクライマー','バイシクルクランチ','ロシアンツイスト','ドラゴンフラッグ']
  },
  '有酸素': {
    '有酸素': [
      'トレッドミル (ランニング)',
      'トレッドミル (傾斜ウォーキング)',
      'エアロバイク (フィットネスバイク)',
      'クロストレーナー (エリプティカル)',
      'ステッパー (階段のぼり)',
      'ローイングマシン',
      '屋外ランニング',
      '屋外ウォーキング'
    ]
  }
};

// ─── App State ──────────────────────────────────────────────
const state = {
  workouts : [],
  meals    : [],
  inbody   : [],
  profile  : null,
  goals    : { cal:2000, p:130, f:50, c:250 },
  customEx : {},
  selectedEquip: 'バーベル',
  selectedCat:   '胸',
  selectedFood:  null,
  pendingMeals:  [],
  calYear: new Date().getFullYear(),
  calMonth: new Date().getMonth(),
  selectedCalDate: null,
  currentPrevWorkout: null,
  deferredPrompt: null
};

// Timer
let timerInterval = null, timerTotal = 90, timerRemaining = 90, timerRunning = false, timerSoundOn = true;
// Charts
let chartBody = null, chartWorkout = null, chartPfc = null;
let currentTab = 'dashboard';

// ─── DOM Helpers ─────────────────────────────────────────────
const qs  = sel => document.querySelector(sel);
const qsa = sel => [...document.querySelectorAll(sel)];
const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));
const todayKey = () => new Date().toISOString().slice(0, 10);

// ─── Toast ──────────────────────────────────────────────────
function toast(msg, type = 'info', dur = 3000) {
  const el = document.createElement('div');
  el.className = `toast ${type}`;
  el.innerHTML = `<span>${{success:'✅',error:'❌',warning:'⚠️',info:'ℹ️'}[type]||''}</span><span>${msg}</span>`;
  qs('#toast-box').appendChild(el);
  setTimeout(() => { el.style.transition='opacity 0.4s'; el.style.opacity='0'; setTimeout(()=>el.remove(),400); }, dur);
}

// ─── Modal ──────────────────────────────────────────────────
function openModal(id)  { qs('#'+id).classList.add('open'); }
function closeModal(id) { qs('#'+id).classList.remove('open'); }

// ─── Storage ─────────────────────────────────────────────────
function saveAll() {
  localStorage.setItem(LS.WORKOUTS,  JSON.stringify(state.workouts));
  localStorage.setItem(LS.MEALS,     JSON.stringify(state.meals));
  localStorage.setItem(LS.INBODY,    JSON.stringify(state.inbody));
  localStorage.setItem(LS.CUSTOM_EX, JSON.stringify(state.customEx));
  if (state.profile) {
    localStorage.setItem(LS.PROFILE, JSON.stringify({...state.profile, goals:state.goals}));
  }
}

function loadAll() {
  const p = k => { try { return JSON.parse(localStorage.getItem(k)); } catch { return null; } };
  state.workouts  = p(LS.WORKOUTS)  || [];
  state.meals     = p(LS.MEALS)     || [];
  state.inbody    = p(LS.INBODY)    || [];
  state.customEx  = p(LS.CUSTOM_EX) || {};
  const prof = p(LS.PROFILE);
  if (prof) {
    if (prof.goals) { Object.assign(state.goals, prof.goals); delete prof.goals; }
    state.profile = prof;
  }
}

// ─── First Time Setup Check ─────────────────────────────────
function checkFirstTimeSetup() {
  if (!state.profile) {
    openModal('modal-first-setup');
  }
}

function handleFirstSetupSubmit(e) {
  e.preventDefault();
  const gender   = qs('#setup-gender').value;
  const age      = parseInt(qs('#setup-age').value) || 28;
  const height   = parseFloat(qs('#setup-height').value) || 170;
  const weight   = parseFloat(qs('#setup-weight').value) || 65;
  const activity = qs('#setup-activity').value;

  const bmr = gender === 'male' ? (10*weight + 6.25*height - 5*age + 5) : (10*weight + 6.25*height - 5*age - 161);
  const actFactors = { sedentary:1.2, light:1.375, moderate:1.55, active:1.725 };
  const tdee = Math.round(bmr * (actFactors[activity] || 1.55));

  const p = Math.round(weight * 2);
  const f = Math.round((tdee * 0.25) / 9);
  const c = Math.max(0, Math.round((tdee - p*4 - f*9) / 4));

  state.profile = { weight, height, age, gender, activity, goal:'maintenance' };
  state.goals = { cal: tdee, p, f, c };

  if (state.inbody.length === 0) {
    state.inbody.push({ id: Date.now(), date: todayKey(), weight, fat: 0, muscle: 0, note: '初期設定データ' });
  }

  saveAll();
  closeModal('modal-first-setup');
  refreshAll();
  toast('初期設定が完了しました！💪', 'success');
}

// ─── Smart PFC Goal Auto-Calculation ────────────────────────
function setupSmartPfcGoalCalc() {
  const calEl = qs('#goal-cal');
  const pEl   = qs('#goal-p');
  const fEl   = qs('#goal-f');
  const cEl   = qs('#goal-c');

  const calcC = () => {
    const cal = parseFloat(calEl.value) || 0;
    const p   = parseFloat(pEl.value)   || 0;
    const f   = parseFloat(fEl.value)   || 0;
    if (cal > 0 && p > 0 && f > 0) {
      const c = Math.max(0, Math.round((cal - (p * 4) - (f * 9)) / 4));
      cEl.value = c;
    }
  };

  calEl.addEventListener('input', calcC);
  pEl.addEventListener('input', calcC);
  fEl.addEventListener('input', calcC);
}

// ─── Navigation ─────────────────────────────────────────────
function switchTab(tabId) {
  qsa('.page').forEach(p=>p.classList.remove('active'));
  qsa('.nav-item').forEach(b=>b.classList.remove('active'));
  qs(`#page-${tabId}`)?.classList.add('active');
  qs(`.nav-item[data-tab="${tabId}"]`)?.classList.add('active');
  currentTab = tabId;
  if (tabId === 'analytics') {
    renderCalendar();
    renderAnalytics();
  }
  window.scrollTo({top:0,behavior:'smooth'});
}

// ─── Timer ──────────────────────────────────────────────────
const TIMER_CIRC = 201.1;
function timerSetTotal(sec) { timerTotal=sec; timerRemaining=sec; if(timerRunning)stopTimer(); renderTimer(); }
function startTimer() {
  if (timerRemaining<=0) timerRemaining=timerTotal;
  timerRunning=true;
  qs('#timer-toggle-label').textContent='一時停止';
  qs('#timer-play-icon').setAttribute('data-lucide','pause');
  lucide.createIcons({nodes:[qs('#timer-play-icon')]});
  qs('#timer-card').classList.add('running');
  timerInterval = setInterval(()=>{ timerRemaining--; renderTimer(); if(timerRemaining<=0){stopTimer();onTimerEnd();} },1000);
}
function stopTimer() {
  clearInterval(timerInterval); timerRunning=false;
  qs('#timer-toggle-label').textContent='スタート';
  qs('#timer-play-icon').setAttribute('data-lucide','play');
  lucide.createIcons({nodes:[qs('#timer-play-icon')]});
  qs('#timer-card').classList.remove('running');
}
function resetTimer() { stopTimer(); timerRemaining=timerTotal; renderTimer(); }
function renderTimer() {
  const m=String(Math.floor(timerRemaining/60)).padStart(2,'0'), s=String(timerRemaining%60).padStart(2,'0');
  qs('#timer-display').textContent=`${m}:${s}`;
  const pct=timerTotal>0?timerRemaining/timerTotal:0;
  qs('#timer-ring').style.strokeDashoffset=TIMER_CIRC*(1-pct);
  const col=timerRemaining<=10?'var(--rose)':timerRemaining<=30?'var(--amber)':'var(--cyan)';
  qs('#timer-ring').style.stroke=col; qs('#timer-display').style.color=col;
}
function onTimerEnd() {
  toast('⏰ インターバル終了！次のセットへ','warning',4000);
  if (!timerSoundOn) return;
  try {
    const ctx=new(window.AudioContext||window.webkitAudioContext)();
    [0,250,500].forEach(d=>setTimeout(()=>{
      const o=ctx.createOscillator(),g=ctx.createGain();
      o.connect(g);g.connect(ctx.destination);
      o.frequency.value=880;o.type='sine';
      g.gain.setValueAtTime(0.3,ctx.currentTime);
      g.gain.exponentialRampToValueAtTime(0.001,ctx.currentTime+0.35);
      o.start();o.stop(ctx.currentTime+0.35);
    },d));
  } catch(_){}
}

// ─── Training / Exercise / Cardio ─────────────────────────────
function getAllExercisesForEquip(equip) {
  const built = EX_DB[equip] || {};
  const custom = state.customEx[equip] || {};
  const merged = {};
  const allCats = new Set([...Object.keys(built), ...Object.keys(custom)]);
  allCats.forEach(cat => {
    merged[cat] = [...(built[cat]||[])];
    (custom[cat]||[]).forEach(ex => { if (!merged[cat].includes(ex)) merged[cat].push(ex); });
  });
  return merged;
}

function buildCategoryTabs() {
  const isCardio = state.selectedEquip === '有酸素';
  const catContainer = qs('#cat-tabs-container');
  const strengthInputs = qs('#strength-inputs');
  const cardioInputs = qs('#cardio-inputs');

  if (isCardio) {
    catContainer.classList.add('hidden');
    strengthInputs.classList.add('hidden');
    cardioInputs.classList.remove('hidden');
    state.selectedCat = '有酸素';
  } else {
    catContainer.classList.remove('hidden');
    strengthInputs.classList.remove('hidden');
    cardioInputs.classList.add('hidden');
  }

  const tabs = qs('#category-tabs');
  const cats = Object.keys(getAllExercisesForEquip(state.selectedEquip));
  if (!cats.includes(state.selectedCat)) state.selectedCat = cats[0] || '胸';

  tabs.innerHTML = cats.map(cat =>
    `<button class="cat-btn ${cat===state.selectedCat?'active':''}" data-cat="${cat}">${cat}</button>`
  ).join('');

  tabs.querySelectorAll('.cat-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      tabs.querySelectorAll('.cat-btn').forEach(b=>b.classList.remove('active'));
      btn.classList.add('active');
      state.selectedCat = btn.dataset.cat;
      populateExerciseSelect();
    });
  });

  populateExerciseSelect();
}

function populateExerciseSelect() {
  const sel  = qs('#exercise-select');
  const exes = (getAllExercisesForEquip(state.selectedEquip)[state.selectedCat]) || [];
  sel.innerHTML = exes.map(e=>`<option value="${e}">${e}</option>`).join('');
  showPrevRecord();
}

function showPrevRecord() {
  const ex   = qs('#exercise-select').value;
  const prev = [...state.workouts].filter(w=>w.exercise===ex).sort((a,b)=>b.date.localeCompare(a.date))[0];
  const alert = qs('#prev-record-alert');
  state.currentPrevWorkout = prev || null;

  if (prev) {
    if (prev.isCardio) {
      qs('#prev-record-text').textContent = `前回 (${prev.date}) — 傾斜${prev.incline}% · 速度${prev.speed}km/h · ${prev.time}分`;
    } else {
      qs('#prev-record-text').textContent = `前回 (${prev.date}) — ${prev.weight}kg × ${prev.reps}r × ${prev.sets}s`;
    }
    alert.classList.remove('hidden');
  } else {
    alert.classList.add('hidden');
  }
  updateRmDisplay();
  updateCardioCalorie();
}

function copyPrevRecordValues() {
  const prev = state.currentPrevWorkout;
  if (!prev) return;

  if (prev.isCardio) {
    qs('#cardio-incline').value = prev.incline || 0;
    qs('#cardio-speed').value   = prev.speed   || 0;
    qs('#cardio-time').value    = prev.time    || 0;
    updateCardioCalorie();
  } else {
    qs('#workout-weight').value = prev.weight || '';
    qs('#workout-reps').value   = prev.reps   || '';
    qs('#workout-sets').value   = prev.sets   || 3;
    updateRmDisplay();
  }
  toast('前回の記録を入力欄にコピーしました⚡', 'info', 1500);
}

function calcOneRM(w,r) { return (!w||!r||r<1) ? null : w*(1+r/30); }

function updateRmDisplay() {
  if (state.selectedEquip === '有酸素') return;
  const w=parseFloat(qs('#workout-weight').value)||0;
  const r=parseInt(qs('#workout-reps').value)||0;
  const s=parseInt(qs('#workout-sets').value)||0;
  const rm=calcOneRM(w,r);
  qs('#val-1rm').textContent  = rm      ? `${rm.toFixed(1)} kg` : '— kg';
  qs('#val-vol').textContent  = (w&&r&&s)? `${(w*r*s).toFixed(0)} kg` : '— kg';
}

function updateCardioCalorie() {
  if (state.selectedEquip !== '有酸素') return;
  const incline = parseFloat(qs('#cardio-incline').value) || 0;
  const speed   = parseFloat(qs('#cardio-speed').value)   || 0;
  const timeMin = parseFloat(qs('#cardio-time').value)    || 0;
  const bodyWeight = (state.profile && state.profile.weight) ? state.profile.weight : 65;

  if (speed <= 0 || timeMin <= 0) {
    qs('#val-cardio-cal').textContent = '— kcal';
    return;
  }

  const speedMpm = (speed * 1000) / 60;
  const inclineFrac = incline / 100;
  let mets = 3.5 + (0.1 * speedMpm) + (1.8 * speedMpm * inclineFrac);
  mets = Math.max(2.5, Math.min(20, mets / 3.5));

  const kcal = (mets * bodyWeight * (timeMin / 60) * 1.05);
  qs('#val-cardio-cal').textContent = `${Math.round(kcal)} kcal`;
}

function renderWorkoutHistory() {
  const list   = qs('#workout-history-list');
  const recent = [...state.workouts].sort((a,b)=>b.date.localeCompare(a.date)).slice(0,20);

  if (!recent.length) {
    list.innerHTML=`<div class="empty-state"><i data-lucide="dumbbell" style="width:34px;height:34px;display:block;margin:0 auto 10px;opacity:0.2;"></i>まだ記録がありません<br><small>最初のセットを記録しましょう！</small></div>`;
    lucide.createIcons({nodes:list.querySelectorAll('[data-lucide]')});
    return;
  }

  list.innerHTML = recent.map(w => {
    if (w.isCardio) {
      return `
        <div class="log-item">
          <div style="flex:1;min-width:0;">
            <div class="log-item-meta">${w.date} · 🏃 有酸素</div>
            <div class="log-item-title">${w.exercise}</div>
            <div class="log-item-stats">
              <span class="chip chip-amber">傾斜 ${w.incline}%</span>
              <span class="chip chip-cyan">速度 ${w.speed}km/h</span>
              <span class="chip chip-green">時間 ${w.time}分</span>
              <span class="chip chip-orange">${w.calories}kcal</span>
            </div>
            ${w.notes?`<div style="font-size:0.72rem;color:var(--text-3);margin-top:4px;">${w.notes}</div>`:''}
          </div>
          <button class="del-btn" data-id="${w.id}" aria-label="削除">
            <i data-lucide="trash-2" style="width:13px;height:13px;"></i>
          </button>
        </div>
      `;
    }
    return `
      <div class="log-item">
        <div style="flex:1;min-width:0;">
          <div class="log-item-meta">${w.date} · ${w.equip||''}</div>
          <div class="log-item-title">${w.exercise}</div>
          <div class="log-item-stats">
            <span class="chip chip-cyan">${w.weight}kg</span>
            <span class="chip chip-green">${w.reps}rep</span>
            <span class="chip chip-amber">${w.sets}set</span>
            ${w.oneRM?`<span class="chip chip-purple">1RM≈${w.oneRM.toFixed(1)}kg</span>`:''}
          </div>
          ${w.notes?`<div style="font-size:0.72rem;color:var(--text-3);margin-top:4px;">${w.notes}</div>`:''}
        </div>
        <button class="del-btn" data-id="${w.id}" aria-label="削除">
          <i data-lucide="trash-2" style="width:13px;height:13px;"></i>
        </button>
      </div>
    `;
  }).join('');

  list.querySelectorAll('.del-btn').forEach(btn => btn.addEventListener('click', () => {
    state.workouts = state.workouts.filter(w => String(w.id) !== btn.dataset.id);
    saveAll(); renderWorkoutHistory(); updateDashboard(); if(currentTab==='analytics') renderCalendar();
  }));
  lucide.createIcons({nodes:list.querySelectorAll('[data-lucide]')});
}

// ─── Food Autocomplete & Batch List ──────────────────────────
function searchFood(query) {
  if (!query || query.length < 1) return [];
  const q = query.toLowerCase();
  return FOOD_DB.filter(f=>f.name.toLowerCase().includes(q)).slice(0,14);
}

function showFoodDropdown(results) {
  const drop = qs('#food-dropdown');
  if (!results.length) {
    drop.innerHTML=`<div class="food-drop-empty">「${qs('#food-search').value}」が見つかりません</div>`;
    drop.classList.remove('hidden');
    return;
  }
  drop.innerHTML = results.map((f,i)=>`
    <div class="food-drop-item" data-idx="${i}">
      <div class="food-drop-name">${f.name}</div>
      <div class="food-drop-meta">${f.cal.toFixed(0)}kcal · P${f.p.toFixed(1)}g · F${f.f.toFixed(1)}g · C${f.c.toFixed(1)}g · Fib${(f.fib||0).toFixed(1)}g</div>
    </div>
  `).join('');
  drop.querySelectorAll('.food-drop-item').forEach((el,i)=>{
    el.addEventListener('mousedown', e=>{ e.preventDefault(); selectFood(results[i]); });
  });
  drop.classList.remove('hidden');
}

function hideFoodDropdown() { qs('#food-dropdown').classList.add('hidden'); }

function selectFood(food) {
  state.selectedFood = food;
  qs('#food-search').value = food.name;
  qs('#food-selected-name').textContent = food.name;
  qs('#food-selected-meta').textContent = `100gあたり: ${food.cal.toFixed(0)}kcal · P${food.p.toFixed(1)}g · F${food.f.toFixed(1)}g · C${food.c.toFixed(1)}g · Fib${(food.fib||0).toFixed(1)}g`;
  qs('#food-selected-card').classList.remove('hidden');

  const uWrap = qs('#unit-btns-wrap');
  const uDiv  = qs('#unit-btns');
  if (food.units && food.units.length > 0) {
    uDiv.innerHTML = food.units.map(([lbl, g]) =>
      `<button type="button" class="unit-btn" data-grams="${g}">${lbl}</button>`
    ).join('') + `<button type="button" class="unit-btn" data-grams="100">100g</button>`;

    uDiv.querySelectorAll('.unit-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        qs('#food-grams').value = btn.dataset.grams;
        calcFoodPFC();
      });
    });
    uWrap.classList.remove('hidden');
    qs('#food-grams').value = food.units[0][1];
  } else {
    uWrap.classList.add('hidden');
    qs('#food-grams').value = 100;
  }

  hideFoodDropdown();
  calcFoodPFC();
}

function calcFoodPFC() {
  if (!state.selectedFood) return;
  const grams = parseFloat(qs('#food-grams').value) || 100;
  const ratio = grams / 100;
  const cal = (state.selectedFood.cal * ratio).toFixed(0);
  const p   = (state.selectedFood.p   * ratio).toFixed(1);
  const f   = (state.selectedFood.f   * ratio).toFixed(1);
  const c   = (state.selectedFood.c   * ratio).toFixed(1);
  const fib = ((state.selectedFood.fib || 0) * ratio).toFixed(1);

  qs('#pfc-cal-preview').textContent = cal;
  qs('#pfc-p-preview').textContent   = p;
  qs('#pfc-f-preview').textContent   = f;
  qs('#pfc-c-preview').textContent   = c;
  qs('#pfc-fib-preview').textContent = fib;

  qs('#modal-meal-name').value = `${state.selectedFood.name} (${grams}g)`;
  qs('#modal-meal-cal').value  = cal;
  qs('#modal-meal-p').value    = p;
  qs('#modal-meal-f').value    = f;
  qs('#modal-meal-c').value    = c;
}

function addCurrentToPendingList() {
  let name, cal, p, f, c, fib;
  const cat = qs('#modal-meal-category').value;
  if (state.selectedFood) {
    const grams = parseFloat(qs('#food-grams').value) || 100;
    const ratio = grams / 100;
    name = `${state.selectedFood.name} (${grams}g)`;
    cal  = parseFloat((state.selectedFood.cal * ratio).toFixed(0));
    p    = parseFloat((state.selectedFood.p   * ratio).toFixed(1));
    f    = parseFloat((state.selectedFood.f   * ratio).toFixed(1));
    c    = parseFloat((state.selectedFood.c   * ratio).toFixed(1));
    fib  = parseFloat(((state.selectedFood.fib||0) * ratio).toFixed(1));
  } else {
    name = qs('#modal-meal-name').value.trim();
    if (!name) { toast('食材または料理名を入力してください','warning'); return; }
    cal  = parseFloat(qs('#modal-meal-cal').value) || 0;
    p    = parseFloat(qs('#modal-meal-p').value)   || 0;
    f    = parseFloat(qs('#modal-meal-f').value)   || 0;
    c    = parseFloat(qs('#modal-meal-c').value)   || 0;
    fib  = 0;
  }

  state.pendingMeals.push({ id: Date.now() + Math.random(), name, category: cat, cal, p, f, c, fib });
  renderPendingList();
  toast(`「${name}」をリストに追加`, 'info', 1500);

  state.selectedFood = null;
  qs('#food-search').value = '';
  qs('#food-grams').value = '';
  qs('#food-selected-card').classList.add('hidden');
  qs('#unit-btns-wrap').classList.add('hidden');
  qs('#pfc-cal-preview').textContent = '—';
  qs('#pfc-p-preview').textContent   = '—';
  qs('#pfc-f-preview').textContent   = '—';
  qs('#pfc-c-preview').textContent   = '—';
  qs('#pfc-fib-preview').textContent = '—';
  qs('#modal-meal-name').value = '';
  qs('#modal-meal-cal').value  = '';
  qs('#modal-meal-p').value    = '';
  qs('#modal-meal-f').value    = '';
  qs('#modal-meal-c').value    = '';
  qs('#food-search').focus();
}

function renderPendingList() {
  const section = qs('#pending-section');
  const list    = qs('#pending-items-list');

  if (!state.pendingMeals.length) {
    section.classList.add('hidden');
    return;
  }

  section.classList.remove('hidden');
  qs('#pending-count').textContent = state.pendingMeals.length;

  let totalCal = 0, totalP = 0, totalF = 0, totalC = 0, totalFib = 0;
  list.innerHTML = state.pendingMeals.map((item, i) => {
    totalCal += item.cal; totalP += item.p; totalF += item.f; totalC += item.c; totalFib += (item.fib||0);
    return `
      <div class="pending-item">
        <div class="pending-item-info">
          <div class="pending-item-name">${item.category ? `[${item.category}] ` : ''}${item.name}</div>
          <div class="pending-item-macros">${item.cal}kcal · P${item.p}g · F${item.f}g · C${item.c}g ${(item.fib>0)?`· Fib${item.fib}g`:''}</div>
        </div>
        <button type="button" class="del-btn" data-idx="${i}" style="width:24px;height:24px;">
          <i data-lucide="x" style="width:12px;height:12px;"></i>
        </button>
      </div>
    `;
  }).join('');

  qs('#pending-total-cal').textContent = `${Math.round(totalCal)} kcal`;
  qs('#pending-total-p').textContent   = totalP.toFixed(1);
  qs('#pending-total-f').textContent   = totalF.toFixed(1);
  qs('#pending-total-c').textContent   = totalC.toFixed(1);
  qs('#pending-total-fib').textContent = totalFib.toFixed(1);

  list.querySelectorAll('.del-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      state.pendingMeals.splice(parseInt(btn.dataset.idx), 1);
      renderPendingList();
    });
  });
  lucide.createIcons({ nodes: list.querySelectorAll('[data-lucide]') });
}

function savePendingMealsBatch() {
  if (!state.pendingMeals.length) return false;
  const now = new Date();
  const time = `${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}`;
  const d = qs('#modal-meal-date').value || todayKey();

  state.pendingMeals.forEach(m => {
    state.meals.push({ id: Date.now() + Math.random(), date: d, time, ...m });
  });

  const count = state.pendingMeals.length;
  state.pendingMeals = [];
  renderPendingList();
  saveAll(); renderMealHistory(); updateMealProgress(); updateDashboard();
  toast(`${count}件の食事を記録しました ✓`, 'success');
  return true;
}

function resetMealModal() {
  qs('#modal-meal-date').value = todayKey();
  qs('#modal-meal-category').value = '朝食';
  state.pendingMeals = [];
  renderPendingList();
  state.selectedFood = null;
  qs('#food-search').value = '';
  qs('#food-grams').value  = '';
  qs('#food-selected-card').classList.add('hidden');
  qs('#unit-btns-wrap').classList.add('hidden');
  hideFoodDropdown();
  qs('#pfc-cal-preview').textContent = '—';
  qs('#pfc-p-preview').textContent   = '—';
  qs('#pfc-f-preview').textContent   = '—';
  qs('#pfc-c-preview').textContent   = '—';
  qs('#pfc-fib-preview').textContent = '—';
  qs('#modal-meal-name').value = '';
  qs('#modal-meal-cal').value  = '';
  qs('#modal-meal-p').value    = '';
  qs('#modal-meal-f').value    = '';
  qs('#modal-meal-c').value    = '';
}

// ─── Meal Tab ────────────────────────────────────────────────
function getTodayMeals()  { return state.meals.filter(m=>m.date===todayKey()); }
function getTodayTotals() {
  return getTodayMeals().reduce((a,m)=>({
    cal:a.cal+(m.cal||0), p:a.p+(m.p||0), f:a.f+(m.f||0), c:a.c+(m.c||0), fib:a.fib+(m.fib||0)
  }),{cal:0,p:0,f:0,c:0,fib:0});
}

function updateMealProgress() {
  const t=getTodayTotals(), g=state.goals;
  const pct=(v,goal)=>clamp(Math.round((v/goal)*100),0,100);

  qs('#meal-cal-num').textContent=Math.round(t.cal);  qs('#meal-cal-tgt').textContent=g.cal;
  qs('#meal-cal-bar').style.width=pct(t.cal,g.cal)+'%';

  qs('#meal-p-num').textContent=`${t.p.toFixed(1)}g`; qs('#meal-p-tgt').textContent=`${g.p}g`;
  qs('#meal-f-num').textContent=`${t.f.toFixed(1)}g`; qs('#meal-f-tgt').textContent=`${g.f}g`;
  qs('#meal-c-num').textContent=`${t.c.toFixed(1)}g`; qs('#meal-c-tgt').textContent=`${g.c}g`;
  qs('#meal-fib-num').textContent=`${t.fib.toFixed(1)}g`;

  qs('#meal-p-bar').style.width=pct(t.p,g.p)+'%';
  qs('#meal-f-bar').style.width=pct(t.f,g.f)+'%';
  qs('#meal-c-bar').style.width=pct(t.c,g.c)+'%';
  qs('#meal-fib-bar').style.width=pct(t.fib, 20)+'%';
}

function renderMealHistory() {
  const list=qs('#meal-history-list'), meals=getTodayMeals();
  if (!meals.length) {
    list.innerHTML=`<div class="empty-state"><i data-lucide="utensils" style="width:34px;height:34px;display:block;margin:0 auto 10px;opacity:0.2;"></i>本日の食事記録はまだありません<br><small>「食事を追加する」から記録しましょう</small></div>`;
    lucide.createIcons({nodes:list.querySelectorAll('[data-lucide]')});
    return;
  }

  // 朝食・昼食・夕食・間食のグループ分け
  const categories = ['朝食', '昼食', '夕食', '間食'];
  let html = '';

  categories.forEach(cat => {
    const catMeals = meals.filter(m => (m.category || '間食') === cat);
    if (catMeals.length > 0) {
      const catCal = catMeals.reduce((a, b) => a + (b.cal || 0), 0);
      const icon = { 朝食:'🌅', 昼食:'☀️', 夕食:'🌙', 間食:'☕' }[cat] || '🍱';
      html += `
        <div class="meal-cat-group">
          <div class="meal-cat-header">
            <span>${icon} ${cat}</span>
            <span style="font-size:0.75rem;color:var(--text-2);">${Math.round(catCal)} kcal</span>
          </div>
          ${catMeals.map(m => `
            <div class="log-item">
              <div style="flex:1;min-width:0;">
                <div class="log-item-meta">${m.time||''}</div>
                <div class="log-item-title">${m.name}</div>
                <div class="log-item-stats">
                  <span class="chip chip-orange">${Math.round(m.cal)}kcal</span>
                  <span class="chip chip-green">P${m.p.toFixed(1)}g</span>
                  <span class="chip chip-amber">F${m.f.toFixed(1)}g</span>
                  <span class="chip chip-cyan">C${m.c.toFixed(1)}g</span>
                  ${(m.fib>0)?`<span class="chip chip-pink">Fib${m.fib.toFixed(1)}g</span>`:''}
                </div>
              </div>
              <button class="del-btn" data-id="${m.id}" aria-label="削除">
                <i data-lucide="trash-2" style="width:13px;height:13px;"></i>
              </button>
            </div>
          `).join('')}
        </div>
      `;
    }
  });

  list.innerHTML = html;

  list.querySelectorAll('.del-btn').forEach(btn=>btn.addEventListener('click',()=>{
    state.meals=state.meals.filter(m=>String(m.id)!==btn.dataset.id);
    saveAll();renderMealHistory();updateMealProgress();updateDashboard();if(currentTab==='analytics')renderCalendar();
  }));
  lucide.createIcons({nodes:list.querySelectorAll('[data-lucide]')});
}

// ─── InBody & Weight Trend ────────────────────────────────────
function renderInBodyHistory() {
  const list=qs('#inbody-history-list'), hist=[...state.inbody].sort((a,b)=>b.date.localeCompare(a.date));
  if (!hist.length) {
    list.innerHTML=`<div class="empty-state"><i data-lucide="activity" style="width:34px;height:34px;display:block;margin:0 auto 10px;opacity:0.2;"></i>まだ測定データがありません</div>`;
    lucide.createIcons({nodes:list.querySelectorAll('[data-lucide]')});
    return;
  }
  list.innerHTML = hist.map(d=>`
    <div class="log-item">
      <div style="flex:1;min-width:0;">
        <div class="log-item-meta">${d.date}</div>
        <div class="log-item-stats" style="margin-top:4px;">
          <span class="chip chip-cyan">体重 ${d.weight}kg</span>
          <span class="chip chip-green">体脂肪 ${d.fat}%</span>
          <span class="chip chip-purple">筋量 ${d.muscle}kg</span>
        </div>
        ${d.note?`<div style="font-size:0.72rem;color:var(--text-3);margin-top:4px;">${d.note}</div>`:''}
      </div>
      <button class="del-btn" data-id="${d.id}" aria-label="削除">
        <i data-lucide="trash-2" style="width:13px;height:13px;"></i>
      </button>
    </div>
  `).join('');
  list.querySelectorAll('.del-btn').forEach(btn=>btn.addEventListener('click',()=>{
    state.inbody=state.inbody.filter(d=>String(d.id)!==btn.dataset.id);
    saveAll();renderInBodyHistory();updateInBodyLatest();updateDashboard();if(currentTab==='analytics')renderCalendar();
  }));
  lucide.createIcons({nodes:list.querySelectorAll('[data-lucide]')});
}

function updateInBodyLatest() {
  const sorted = [...state.inbody].sort((a,b)=>a.date.localeCompare(b.date));
  const latest = sorted[sorted.length - 1];

  if (latest) {
    qs('#val-inbody-weight').textContent = latest.weight;
    qs('#val-inbody-fat').textContent    = latest.fat;
    qs('#val-inbody-muscle').textContent = latest.muscle;
    qs('#inbody-latest-date').textContent= latest.date;
    qs('#dash-inbody-sub').textContent   = `最新: ${latest.date} / ${latest.weight}kg`;
  } else {
    ['#val-inbody-weight','#val-inbody-fat','#val-inbody-muscle'].forEach(s=>qs(s).textContent='—');
    qs('#inbody-latest-date').textContent = '未測定';
    qs('#dash-inbody-sub').textContent    = '最新: 未登録';
  }

  const now = new Date();
  const msInDay = 86400000;

  const past7Days  = sorted.filter(d => (now - new Date(d.date)) / msInDay <= 7);
  const prev7Days  = sorted.filter(d => {
    const diff = (now - new Date(d.date)) / msInDay;
    return diff > 7 && diff <= 14;
  });
  const thisMonth  = sorted.filter(d => {
    const dt = new Date(d.date);
    return dt.getFullYear() === now.getFullYear() && dt.getMonth() === now.getMonth();
  });

  const avg = arr => arr.length > 0 ? (arr.reduce((a,b)=>a+b.weight, 0) / arr.length) : null;

  const weekAvg = avg(past7Days);
  const prevAvg = avg(prev7Days);
  const monthAvg = avg(thisMonth);

  qs('#trend-week-val').textContent  = weekAvg ? `${weekAvg.toFixed(1)} kg` : '— kg';
  qs('#trend-month-val').textContent = monthAvg ? `${monthAvg.toFixed(1)} kg` : '— kg';

  const diffEl = qs('#trend-diff-val');
  if (weekAvg && prevAvg) {
    const diff = weekAvg - prevAvg;
    const sign = diff > 0 ? '＋' : '';
    diffEl.textContent = `${sign}${diff.toFixed(1)} kg`;
    diffEl.style.color = diff > 0 ? 'var(--amber)' : diff < 0 ? 'var(--cyan)' : 'var(--green)';
  } else {
    diffEl.textContent = '— kg';
    diffEl.style.color = 'var(--cyan)';
  }
}

// ─── Calendar Feature ────────────────────────────────────────
function renderCalendar() {
  const y = state.calYear, m = state.calMonth;
  qs('#cal-month-label').textContent = `${y}年 ${m + 1}月`;

  const firstDay = new Date(y, m, 1).getDay();
  const daysInMonth = new Date(y, m + 1, 0).getDate();
  const container = qs('#cal-days');
  const today = todayKey();

  let html = '';
  for (let i = 0; i < firstDay; i++) {
    html += `<div class="cal-day-empty"></div>`;
  }

  for (let d = 1; d <= daysInMonth; d++) {
    const dateStr = `${y}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    const hasWorkout = state.workouts.some(w => w.date === dateStr);
    const hasMeal    = state.meals.some(w => w.date === dateStr);
    const hasInbody  = state.inbody.some(w => w.date === dateStr);

    const isToday    = dateStr === today;
    const isSelected = dateStr === state.selectedCalDate;

    let dots = '';
    if (hasWorkout) dots += `<div class="cal-dot" style="background:var(--cyan);"></div>`;
    if (hasMeal)    dots += `<div class="cal-dot" style="background:var(--orange);"></div>`;
    if (hasInbody)  dots += `<div class="cal-dot" style="background:var(--green);"></div>`;

    html += `
      <div class="cal-day ${isToday?'today':''} ${isSelected?'selected':''}" data-date="${dateStr}">
        <span class="cal-day-num">${d}</span>
        <div class="cal-day-dots">${dots}</div>
      </div>
    `;
  }

  container.innerHTML = html;

  container.querySelectorAll('.cal-day').forEach(el => {
    el.addEventListener('click', () => {
      state.selectedCalDate = el.dataset.date;
      renderCalendar();
      showCalendarDayDetail(el.dataset.date);
    });
  });

  if (state.selectedCalDate) showCalendarDayDetail(state.selectedCalDate);
}

function showCalendarDayDetail(dateStr) {
  const card = qs('#cal-day-detail');
  card.classList.remove('hidden');

  const workouts = state.workouts.filter(w => w.date === dateStr);
  const meals    = state.meals.filter(m => m.date === dateStr);
  const inbody   = state.inbody.find(b => b.date === dateStr);

  const dayMealTotal = meals.reduce((acc, m) => ({
    cal: acc.cal + (m.cal||0), p: acc.p + (m.p||0), f: acc.f + (m.f||0), c: acc.c + (m.c||0), fib: acc.fib + (m.fib||0)
  }), { cal: 0, p: 0, f: 0, c: 0, fib: 0 });

  let html = `<div class="cal-detail-date">📅 ${dateStr} の記録</div>`;

  // Workout / Cardio
  html += `<div class="cal-detail-section">
    <div class="cal-detail-section-title" style="color:var(--cyan);">🏋️ 運動・トレーニング (${workouts.length}件)</div>`;
  if (workouts.length) {
    html += workouts.map(w => {
      if (w.isCardio) {
        return `
          <div style="font-size:0.8rem;margin-bottom:4px;">
            <strong>🏃 ${w.exercise}</strong> — <span class="chip chip-amber">傾斜${w.incline}%</span> <span class="chip chip-cyan">${w.speed}km/h</span> <span class="chip chip-green">${w.time}分</span> <span class="chip chip-orange">${w.calories}kcal</span>
          </div>
        `;
      }
      return `
        <div style="font-size:0.8rem;margin-bottom:4px;">
          <strong>🏋️ ${w.exercise}</strong> — <span class="chip chip-cyan">${w.weight}kg × ${w.reps}r × ${w.sets}s</span>
        </div>
      `;
    }).join('');
  } else {
    html += `<div class="cal-detail-empty">記録なし</div>`;
  }
  html += `</div>`;

  // Meal
  html += `<div class="cal-detail-section">
    <div class="cal-detail-section-title" style="color:var(--orange);">🍱 食事 (${Math.round(dayMealTotal.cal)} kcal)</div>`;
  if (meals.length) {
    html += `<div style="font-size:0.75rem;color:var(--text-2);margin-bottom:4px;">
      P ${dayMealTotal.p.toFixed(1)}g | F ${dayMealTotal.f.toFixed(1)}g | C ${dayMealTotal.c.toFixed(1)}g | Fib ${dayMealTotal.fib.toFixed(1)}g
    </div>`;
    html += meals.map(m => `
      <div style="font-size:0.78rem;color:var(--text-2);margin-bottom:2px;">
        • [${m.category||'食事'}] ${m.name} (${Math.round(m.cal)}kcal)
      </div>
    `).join('');
  } else {
    html += `<div class="cal-detail-empty">記録なし</div>`;
  }
  html += `</div>`;

  // InBody
  html += `<div class="cal-detail-section">
    <div class="cal-detail-section-title" style="color:var(--green);">⚖️ 体組成</div>`;
  if (inbody) {
    html += `<div style="font-size:0.8rem;">
      <span class="chip chip-cyan">体重 ${inbody.weight}kg</span>
      <span class="chip chip-green">体脂肪 ${inbody.fat}%</span>
      <span class="chip chip-purple">筋量 ${inbody.muscle}kg</span>
    </div>`;
  } else {
    html += `<div class="cal-detail-empty">測定なし</div>`;
  }
  html += `</div>`;

  card.innerHTML = html;
}

// ─── Dashboard (Calorie Balance & Summary) ─────────────────────
function updateDashboard() {
  const t = getTodayTotals();
  const g = state.goals;
  const CIRC = 188.5;

  const pct = clamp(t.cal / g.cal, 0, 1);
  qs('#dash-cal-ring').style.strokeDashoffset = CIRC * (1 - pct);
  qs('#dash-cal-num').textContent    = Math.round(t.cal);
  qs('#dash-cal-target').textContent = g.cal;
  qs('#dash-cal-pct').textContent    = Math.round(pct * 100) + '%';

  qs('#dash-p-val').textContent   = `${t.p.toFixed(1)}g`; qs('#dash-p-tgt').textContent   = `${g.p}g`;
  qs('#dash-f-val').textContent   = `${t.f.toFixed(1)}g`; qs('#dash-f-tgt').textContent   = `${g.f}g`;
  qs('#dash-c-val').textContent   = `${t.c.toFixed(1)}g`; qs('#dash-c-tgt').textContent   = `${g.c}g`;
  qs('#dash-fib-val').textContent = `${t.fib.toFixed(1)}g`;

  qs('#dash-p-bar').style.width   = clamp((t.p / g.p) * 100, 0, 100) + '%';
  qs('#dash-f-bar').style.width   = clamp((t.f / g.f) * 100, 0, 100) + '%';
  qs('#dash-c-bar').style.width   = clamp((t.c / g.c) * 100, 0, 100) + '%';
  qs('#dash-fib-bar').style.width = clamp((t.fib / 20) * 100, 0, 100) + '%';

  if (!state.profile) {
    qs('#bal-status-val').textContent = '— kcal';
    qs('#bal-in-val').textContent     = '0';
    qs('#bal-out-val').textContent    = '0';
    qs('#bal-cardio-val').textContent = '0';
    return;
  }

  const w   = state.profile.weight || 65;
  const h   = state.profile.height || 170;
  const a   = state.profile.age    || 28;
  const gen = state.profile.gender || 'male';
  const act = state.profile.activity || 'moderate';

  const bmr = gen === 'male' ? (10*w + 6.25*h - 5*a + 5) : (10*w + 6.25*h - 5*a - 161);
  const actFactors = { sedentary:1.2, light:1.375, moderate:1.55, active:1.725 };
  const baseTDEE   = Math.round(bmr * (actFactors[act] || 1.55));

  const todayWorkouts = state.workouts.filter(w => w.date === todayKey());
  const cardioBurn    = todayWorkouts.filter(w => w.isCardio).reduce((acc, w) => acc + (w.calories || 0), 0);

  const totalExpenditure = baseTDEE + cardioBurn;
  const intake           = Math.round(t.cal);
  const balance          = intake - totalExpenditure;

  qs('#bal-in-val').textContent     = intake;
  qs('#bal-out-val').textContent    = totalExpenditure;
  qs('#bal-cardio-val').textContent = cardioBurn;

  const balBadge = qs('#bal-status-val');
  if (balance > 0) {
    balBadge.textContent = `＋${balance} kcal`;
    balBadge.style.color = 'var(--amber)';
  } else if (balance < 0) {
    balBadge.textContent = `${balance} kcal`;
    balBadge.style.color = 'var(--cyan)';
  } else {
    balBadge.textContent = `±0 kcal`;
    balBadge.style.color = 'var(--green)';
  }

  const strengthSets = todayWorkouts.filter(w => !w.isCardio).reduce((acc, w) => acc + (w.sets || 0), 0);
  const cardioMins   = todayWorkouts.filter(w => w.isCardio).reduce((acc, w) => acc + (w.time || 0), 0);

  let subText = `本日 `;
  if (strengthSets > 0 && cardioMins > 0) subText += `${strengthSets}セット / 有酸素${cardioMins}分`;
  else if (strengthSets > 0) subText += `${strengthSets}セット`;
  else if (cardioMins > 0) subText += `有酸素 ${cardioMins}分`;
  else subText += `0 セット`;

  qs('#dash-workout-sub').textContent = subText;
  updateInBodyLatest();

  const d = new Date(), days = ['日','月','火','水','木','金','土'];
  qs('#hero-date').textContent = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}（${days[d.getDay()]}）`;
  const ms = new Date();
  qs('#meal-date-chip').textContent = `${ms.getMonth()+1}/${ms.getDate()}`;
}

// ─── Analytics Charts ────────────────────────────────────────
const CHART_BASE = {
  responsive:true, maintainAspectRatio:false, animation:{duration:600},
  plugins:{
    legend:{labels:{color:'#94a3b8',boxWidth:12,font:{size:11}}},
    tooltip:{backgroundColor:'#1a2235',borderColor:'rgba(255,255,255,0.1)',borderWidth:1,titleColor:'#f1f5f9',bodyColor:'#94a3b8',padding:10,cornerRadius:8}
  },
  scales:{
    x:{grid:{color:'rgba(255,255,255,0.04)'},ticks:{color:'#64748b',font:{size:10}}},
    y:{grid:{color:'rgba(255,255,255,0.04)'},ticks:{color:'#64748b',font:{size:10}}},
  }
};

function buildAnalyticsExSelect() {
  const sel=qs('#analytics-ex-select');
  const exes=[...new Set(state.workouts.map(w=>w.exercise))];
  if (!exes.length) { sel.innerHTML='<option>記録なし</option>'; return; }
  sel.innerHTML=exes.map(e=>`<option value="${e}">${e}</option>`).join('');
  sel.addEventListener('change',()=>renderWorkoutChart(sel.value));
}

function renderAnalytics() {
  renderBodyChart(); buildAnalyticsExSelect();
  const sel=qs('#analytics-ex-select');
  if (sel.value && sel.value!=='記録なし') renderWorkoutChart(sel.value);
  renderPfcChart();
}

function renderBodyChart() {
  const sorted=[...state.inbody].sort((a,b)=>a.date.localeCompare(b.date)).slice(-30);
  const ctx=qs('#chart-body').getContext('2d');
  if (chartBody) chartBody.destroy();
  chartBody=new Chart(ctx,{type:'line',data:{
    labels:sorted.map(d=>d.date.slice(5)),
    datasets:[
      {label:'体重(kg)',data:sorted.map(d=>d.weight),borderColor:'#38bdf8',backgroundColor:'rgba(56,189,248,0.08)',tension:0.4,pointRadius:4},
      {label:'骨格筋量(kg)',data:sorted.map(d=>d.muscle),borderColor:'#a855f7',backgroundColor:'rgba(168,85,247,0.08)',tension:0.4,pointRadius:4},
      {label:'体脂肪率(%)',data:sorted.map(d=>d.fat),borderColor:'#22c55e',backgroundColor:'rgba(34,197,94,0.08)',tension:0.4,pointRadius:4},
    ]
  },options:{...CHART_BASE}});
}

function renderWorkoutChart(exercise) {
  const records=state.workouts.filter(w=>w.exercise===exercise).sort((a,b)=>a.date.localeCompare(b.date)).slice(-20);
  const ctx=qs('#chart-workout').getContext('2d');
  if (chartWorkout) chartWorkout.destroy();

  const isCardio = records.length > 0 && records[0].isCardio;

  if (isCardio) {
    chartWorkout=new Chart(ctx,{type:'bar',data:{
      labels:records.map(w=>w.date.slice(5)),
      datasets:[
        {label:'時間(分)',data:records.map(w=>w.time),backgroundColor:'rgba(34,197,94,0.45)',borderColor:'#22c55e',borderWidth:1.5,yAxisID:'y',order:2},
        {label:'消費カロリー(kcal)',data:records.map(w=>w.calories),type:'line',borderColor:'#f97316',backgroundColor:'rgba(249,115,22,0.08)',tension:0.4,pointRadius:4,yAxisID:'y1',order:1}
      ]
    },options:{...CHART_BASE,scales:{x:{...CHART_BASE.scales.x},y:{...CHART_BASE.scales.y,position:'left'},y1:{...CHART_BASE.scales.y,position:'right',grid:{drawOnChartArea:false}}}}});
  } else {
    chartWorkout=new Chart(ctx,{type:'bar',data:{
      labels:records.map(w=>w.date.slice(5)),
      datasets:[
        {label:'ボリューム(kg)',data:records.map(w=>w.weight*w.reps*w.sets),backgroundColor:'rgba(56,189,248,0.45)',borderColor:'#38bdf8',borderWidth:1.5,yAxisID:'y',order:2},
        {label:'推定1RM(kg)',data:records.map(w=>w.oneRM||0),type:'line',borderColor:'#f59e0b',backgroundColor:'rgba(245,158,11,0.08)',tension:0.4,pointRadius:4,yAxisID:'y1',order:1}
      ]
    },options:{...CHART_BASE,scales:{x:{...CHART_BASE.scales.x},y:{...CHART_BASE.scales.y,position:'left'},y1:{...CHART_BASE.scales.y,position:'right',grid:{drawOnChartArea:false}}}}});
  }
}

function renderPfcChart() {
  const t=getTodayTotals();
  const ctx=qs('#chart-pfc').getContext('2d');
  if (chartPfc) chartPfc.destroy();
  const total=t.p*4+t.f*9+t.c*4;
  chartPfc=new Chart(ctx,{type:'doughnut',data:{
    labels:['タンパク質 P','脂質 F','炭水化物 C'],
    datasets:[{data:[t.p*4,t.f*9,t.c*4],backgroundColor:['rgba(34,197,94,0.8)','rgba(245,158,11,0.8)','rgba(56,189,248,0.8)'],borderColor:['#22c55e','#f59e0b','#38bdf8'],borderWidth:1.5}]
  },options:{responsive:true,maintainAspectRatio:false,plugins:{legend:CHART_BASE.plugins.legend,tooltip:{...CHART_BASE.plugins.tooltip,callbacks:{label:ctx=>`${ctx.label}: ${ctx.raw.toFixed(0)}kcal (${total>0?Math.round((ctx.raw/total)*100):0}%)`}}},cutout:'60%',animation:{animateRotate:true,duration:700}}});
}

// ─── Settings ────────────────────────────────────────────────
function loadSettingsToForm() {
  const p = state.profile || {};
  qs('#prf-weight').value=p.weight||'';
  qs('#prf-height').value=p.height||'';
  qs('#prf-age').value=p.age||'';
  qs('#prf-gender').value=p.gender||'male';
  qs('#prf-activity').value=p.activity||'moderate';
  qs('#prf-goal').value=p.goal||'maintenance';
  qs('#goal-cal').value=state.goals.cal;
  qs('#goal-p').value=state.goals.p;
  qs('#goal-f').value=state.goals.f;
  qs('#goal-c').value=state.goals.c;
}

function calcTDEE() {
  const w=parseFloat(qs('#prf-weight').value)||65, h=parseFloat(qs('#prf-height').value)||170;
  const a=parseInt(qs('#prf-age').value)||28, g=qs('#prf-gender').value;
  const act=qs('#prf-activity').value, goal=qs('#prf-goal').value;
  const bmr=g==='male'?10*w+6.25*h-5*a+5:10*w+6.25*h-5*a-161;
  const f={sedentary:1.2,light:1.375,moderate:1.55,active:1.725};
  let tdee=bmr*(f[act]||1.55);
  if (goal==='cutting') tdee-=300; if (goal==='bulking') tdee+=300;
  const p=Math.round(w*2), fat=Math.round((tdee*0.25)/9), c=Math.max(0,Math.round((tdee-p*4-fat*9)/4));
  qs('#goal-cal').value=Math.round(tdee); qs('#goal-p').value=p; qs('#goal-f').value=fat; qs('#goal-c').value=c;
  toast(`TDEE: ${Math.round(tdee)} kcal で計算しました`,'success');
}

// ─── Export / Import ─────────────────────────────────────────
function exportJSON() {
  const blob=new Blob([JSON.stringify({workouts:state.workouts,meals:state.meals,inbody:state.inbody,goals:state.goals,profile:state.profile,customEx:state.customEx,exportedAt:new Date().toISOString()},null,2)],{type:'application/json'});
  const a=document.createElement('a'); a.href=URL.createObjectURL(blob); a.download=`fitpulse_backup_${todayKey()}.json`; a.click(); URL.revokeObjectURL(a.href);
  toast('バックアップをダウンロードしました','success');
}
function importJSON(file) {
  if (!file) return;
  const reader=new FileReader();
  reader.onload=e=>{
    try {
      const d=JSON.parse(e.target.result);
      if (d.workouts) state.workouts=d.workouts; if (d.meals) state.meals=d.meals;
      if (d.inbody) state.inbody=d.inbody; if (d.goals) Object.assign(state.goals,d.goals);
      if (d.profile) state.profile=d.profile; if (d.customEx) state.customEx=d.customEx;
      saveAll(); refreshAll(); toast('バックアップから復元しました','success');
    } catch { toast('JSONファイルが無効です','error'); }
  };
  reader.readAsText(file);
}

// ─── Full Refresh ────────────────────────────────────────────
function refreshAll() {
  updateDashboard(); renderWorkoutHistory();
  renderMealHistory(); updateMealProgress();
  renderInBodyHistory(); updateInBodyLatest();
  if (currentTab==='analytics') { renderCalendar(); renderAnalytics(); }
}

// ─── Event Bindings ──────────────────────────────────────────
function bindEvents() {
  // PWA Install Prompt Listener
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    state.deferredPrompt = e;
    const banner = qs('#pwa-banner');
    if (banner) banner.classList.remove('hidden');
  });

  const installBtn = qs('#pwa-install-btn');
  if (installBtn) {
    installBtn.addEventListener('click', async () => {
      if (state.deferredPrompt) {
        state.deferredPrompt.prompt();
        const { outcome } = await state.deferredPrompt.userChoice;
        if (outcome === 'accepted') {
          toast('アプリをホーム画面に追加しました！🎉', 'success');
        }
        state.deferredPrompt = null;
        qs('#pwa-banner').classList.add('hidden');
      }
    });
  }

  qsa('.nav-item').forEach(btn=>btn.addEventListener('click',()=>switchTab(btn.dataset.tab)));
  qsa('.nav-to').forEach(el=>el.addEventListener('click',()=>switchTab(el.dataset.target)));

  qsa('.modal-close').forEach(btn=>btn.addEventListener('click',()=>closeModal(btn.dataset.modal)));
  qsa('.modal-overlay').forEach(o=>o.addEventListener('click',e=>{ if(e.target===o && o.id !== 'modal-first-setup') o.classList.remove('open'); }));

  qs('#first-setup-form').addEventListener('submit', handleFirstSetupSubmit);

  setupSmartPfcGoalCalc();

  qs('#settings-open-btn').addEventListener('click',()=>{ loadSettingsToForm(); openModal('modal-settings'); });
  qsa('.settings-tab-btn').forEach(btn=>btn.addEventListener('click',()=>{
    qsa('.settings-tab-btn').forEach(b=>b.classList.remove('active'));
    qsa('.settings-panel').forEach(p=>p.classList.remove('active'));
    btn.classList.add('active'); qs('#'+btn.dataset.panel).classList.add('active');
  }));
  qs('#calc-tdee-btn').addEventListener('click',calcTDEE);
  qs('#save-goals-btn').addEventListener('click',()=>{
    if (!state.profile) state.profile = {};
    state.profile.weight=parseFloat(qs('#prf-weight').value)||65;
    state.profile.height=parseFloat(qs('#prf-height').value)||170;
    state.profile.age=parseInt(qs('#prf-age').value)||28;
    state.profile.gender=qs('#prf-gender').value; state.profile.activity=qs('#prf-activity').value; state.profile.goal=qs('#prf-goal').value;
    state.goals.cal=parseFloat(qs('#goal-cal').value)||2000; state.goals.p=parseFloat(qs('#goal-p').value)||130;
    state.goals.f=parseFloat(qs('#goal-f').value)||50; state.goals.c=parseFloat(qs('#goal-c').value)||250;
    saveAll(); updateDashboard(); updateMealProgress(); toast('目標を保存しました','success'); closeModal('modal-settings');
  });
  qs('#export-btn').addEventListener('click',exportJSON);
  qs('#import-input').addEventListener('change',e=>{ importJSON(e.target.files[0]); e.target.value=''; });
  qs('#clear-all-btn').addEventListener('click',()=>{
    if (!confirm('全データを削除しますか？\nこの操作は元に戻せません。')) return;
    state.workouts=[]; state.meals=[]; state.inbody=[]; state.profile=null;
    saveAll(); refreshAll(); toast('全データを削除しました','warning'); closeModal('modal-settings'); checkFirstTimeSetup();
  });

  qs('#cal-prev').addEventListener('click', () => {
    state.calMonth--;
    if (state.calMonth < 0) { state.calMonth = 11; state.calYear--; }
    renderCalendar();
  });
  qs('#cal-next').addEventListener('click', () => {
    state.calMonth++;
    if (state.calMonth > 11) { state.calMonth = 0; state.calYear++; }
    renderCalendar();
  });

  qs('#timer-toggle-btn').addEventListener('click',()=>timerRunning?stopTimer():startTimer());
  qs('#timer-reset-btn').addEventListener('click',resetTimer);
  qsa('.timer-preset-btn').forEach(btn=>btn.addEventListener('click',()=>timerSetTotal(parseInt(btn.dataset.sec))));
  qs('#timer-sound-btn').addEventListener('click',()=>{
    timerSoundOn=!timerSoundOn;
    const icon=qs('#timer-sound-icon');
    icon.setAttribute('data-lucide',timerSoundOn?'volume-2':'volume-x');
    icon.style.color=timerSoundOn?'var(--cyan)':'var(--text-3)';
    lucide.createIcons({nodes:[icon]});
    toast(timerSoundOn?'サウンド ON':'サウンド OFF','info',1500);
  });

  qsa('.equip-btn').forEach(btn=>btn.addEventListener('click',()=>{
    qsa('.equip-btn').forEach(b=>b.classList.remove('active'));
    btn.classList.add('active');
    state.selectedEquip=btn.dataset.equip;
    buildCategoryTabs();
  }));

  qs('#exercise-select').addEventListener('change',showPrevRecord);
  qs('#copy-prev-btn').addEventListener('click', copyPrevRecordValues);

  qs('#workout-weight').addEventListener('input',updateRmDisplay);
  qs('#workout-reps').addEventListener('input',updateRmDisplay);
  qs('#workout-sets').addEventListener('input',updateRmDisplay);

  qs('#cardio-incline').addEventListener('input',updateCardioCalorie);
  qs('#cardio-speed').addEventListener('input',updateCardioCalorie);
  qs('#cardio-time').addEventListener('input',updateCardioCalorie);

  qs('#workout-date-input').value = todayKey();

  qs('#workout-form').addEventListener('submit',e=>{
    e.preventDefault();
    const ex=qs('#exercise-select').value;
    const n=qs('#workout-notes').value.trim();
    const date=qs('#workout-date-input').value || todayKey();

    if (state.selectedEquip === '有酸素') {
      const incline = parseFloat(qs('#cardio-incline').value) || 0;
      const speed   = parseFloat(qs('#cardio-speed').value)   || 0;
      const time    = parseInt(qs('#cardio-time').value)       || 0;

      if (!ex || speed <= 0 || time <= 0) {
        toast('速度 (km/h) と 時間 (分) を入力してください','warning');
        return;
      }

      const caloriesStr = qs('#val-cardio-cal').textContent;
      const calories = parseInt(caloriesStr) || 0;

      state.workouts.push({
        id: Date.now(), date,
        equip: '有酸素', exercise: ex, isCardio: true,
        incline, speed, time, calories, notes: n
      });

      saveAll(); renderWorkoutHistory(); updateDashboard();
      toast(`🏃 ${ex} ${time}分 (${calories}kcal) を記録しました ✓`,'success');

    } else {
      const w=parseFloat(qs('#workout-weight').value);
      const r=parseInt(qs('#workout-reps').value);
      const s=parseInt(qs('#workout-sets').value);
      if (!ex||!w||!r||!s) { toast('種目・重量・Rep・Set を入力してください','warning'); return; }

      state.workouts.push({
        id:Date.now(), date,
        equip:state.selectedEquip, exercise:ex, isCardio:false,
        weight:w, reps:r, sets:s, notes:n, oneRM:calcOneRM(w,r)
      });

      saveAll(); renderWorkoutHistory(); updateDashboard();
      toast(`${ex} ${w}kg × ${r}rep × ${s}set を記録しました ✓`,'success');
      if (!timerRunning) startTimer();
    }

    qs('#workout-notes').value='';
  });

  qs('#custom-ex-open-btn').addEventListener('click',()=>openModal('modal-custom-ex'));
  qs('#save-custom-ex-btn').addEventListener('click',()=>{
    const name=qs('#modal-custom-name').value.trim();
    const equip=qs('#modal-custom-equip').value;
    const cat=qs('#modal-custom-cat').value;
    if (!name) { toast('種目名を入力してください','warning'); return; }
    if (!state.customEx[equip]) state.customEx[equip]={};
    if (!state.customEx[equip][cat]) state.customEx[equip][cat]=[];
    if (!state.customEx[equip][cat].includes(name)) {
      state.customEx[equip][cat].push(name);
      saveAll(); buildCategoryTabs(); toast(`「${name}」を追加しました`,'success');
    } else { toast('すでに登録されています','warning'); }
    qs('#modal-custom-name').value='';
    closeModal('modal-custom-ex');
  });

  const foodSearch = qs('#food-search');
  foodSearch.addEventListener('input',()=>{
    const q=foodSearch.value.trim();
    if (!q) { hideFoodDropdown(); return; }
    showFoodDropdown(searchFood(q));
  });
  foodSearch.addEventListener('focus',()=>{
    const q=foodSearch.value.trim();
    if (q) showFoodDropdown(searchFood(q));
  });
  foodSearch.addEventListener('blur',()=>{ setTimeout(hideFoodDropdown,150); });
  foodSearch.addEventListener('keydown',e=>{ if (e.key==='Escape') hideFoodDropdown(); });

  qs('#food-grams').addEventListener('input',calcFoodPFC);
  qs('#food-calc-btn').addEventListener('click',calcFoodPFC);

  qs('#add-to-list-btn').addEventListener('click', addCurrentToPendingList);

  qs('#save-all-btn').addEventListener('click', () => {
    if (savePendingMealsBatch()) {
      closeModal('modal-meal');
    }
  });

  qs('#meal-add-btn').addEventListener('click',()=>{ resetMealModal(); openModal('modal-meal'); });

  qs('#save-meal-btn').addEventListener('click',()=>{
    if (state.pendingMeals.length > 0) {
      savePendingMealsBatch();
      closeModal('modal-meal');
      return;
    }
    const name=qs('#modal-meal-name').value.trim();
    if (!name) { toast('料理名を入力してください','warning'); return; }
    const cal=parseFloat(qs('#modal-meal-cal').value)||0;
    const p=parseFloat(qs('#modal-meal-p').value)||0;
    const f=parseFloat(qs('#modal-meal-f').value)||0;
    const c=parseFloat(qs('#modal-meal-c').value)||0;
    const cat=qs('#modal-meal-category').value;
    const d=qs('#modal-meal-date').value || todayKey();
    const now=new Date();
    const time=`${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}`;
    state.meals.push({id:Date.now(),date:d,time,category:cat,name,cal,p,f,c});
    saveAll(); renderMealHistory(); updateMealProgress(); updateDashboard();
    closeModal('modal-meal'); toast(`「${name}」を記録しました ✓`,'success');
  });

  qs('#inbody-add-btn').addEventListener('click',()=>{
    qs('#modal-inbody-date').value=todayKey();
    qs('#modal-inbody-weight').value=''; qs('#modal-inbody-fat').value='';
    qs('#modal-inbody-muscle').value=''; qs('#modal-inbody-note').value='';
    openModal('modal-inbody');
  });
  qs('#save-inbody-btn').addEventListener('click',()=>{
    const date=qs('#modal-inbody-date').value||todayKey();
    const weight=parseFloat(qs('#modal-inbody-weight').value);
    const fat=parseFloat(qs('#modal-inbody-fat').value)||0;
    const muscle=parseFloat(qs('#modal-inbody-muscle').value)||0;
    const note=qs('#modal-inbody-note').value.trim();
    if (!weight) { toast('体重を入力してください','warning'); return; }
    state.inbody.push({id:Date.now(),date,weight,fat,muscle,note});
    saveAll(); renderInBodyHistory(); updateInBodyLatest(); updateDashboard();
    closeModal('modal-inbody'); toast('体組成データを保存しました ✓','success');
  });
}

// ─── Init ────────────────────────────────────────────────────
function init() {
  loadAll();
  lucide.createIcons();
  buildCategoryTabs();
  renderTimer();
  updateDashboard();
  renderWorkoutHistory();
  renderMealHistory();
  updateMealProgress();
  renderInBodyHistory();
  updateInBodyLatest();
  bindEvents();
  checkFirstTimeSetup();
}

document.addEventListener('DOMContentLoaded', init);
