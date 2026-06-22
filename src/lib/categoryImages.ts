import type { CSSProperties } from "react";

// Картинки категорий (public/images/categories/*.jpg). Единый источник для
// карточек каталога (HierarchicalCatalog) и фоновых hero (категория/тип).
const C = (name: string) => `/images/categories/${name}.jpg`;

export const CATEGORY_IMAGES: Record<string, string> = {
  // Крепеж
  "krepezh-bolty": C("bolty"),
  "krepezh-gayki": C("gayki"),
  "krepezh-shayby": C("shayby"),
  "krepezh-vintyi": C("vintyi"),
  "krepezh-ankera": C("ankera"),
  "krepezh-shplinty": C("shplinty"),
  "krepezh-dyubela": C("dyubela"),
  "krepezh-samorezi": C("samorezi"),
  "krepezh-shpilki": C("shpilki"),
  "krepezh-zaklepki": C("zaklepki"),
  "krepezh-gvozdi": C("gvozdi"),
  // Нержавейка
  "nerzhav-bolty": C("nerzhav"),
  "nerzhav-gayki": C("gayki"),
  "nerzhav-shayby": C("shayby"),
  "nerzhav-vintyi": C("vintyi"),
  "nerzhav-shpilki": C("shpilki"),
  // Такелаж
  "takelazh-vertlyug": C("takelazh-vertlyug"),
  "takelazh-zazim-din741": C("takelazh-zazim-din741"),
  "takelazh-zazim-din3093": C("takelazh-zazim-din3093"),
  "takelazh-zazim-dvoinoi": C("takelazh-zazim-dvoinoi"),
  "takelazh-zazim-odinarnyi": C("takelazh-zazim-odinarnyi"),
  "takelazh-karabin-5299c": C("karabin"),
  "takelazh-karabin-5299d": C("takelazh-karabin-5299d"),
  "takelazh-koush-6899b": C("takelazh-koush-6899b"),
  "takelazh-kryuk-320a": C("takelazh-kryuk-320a"),
  "takelazh-kryuk-s": C("takelazh-kryuk-s"),
  "takelazh-rym-bolt": C("takelazh-rym-bolt"),
  "takelazh-rym-gayka": C("takelazh-rym-gayka"),
  "takelazh-skoba-g209": C("takelazh-skoba-g209"),
  "takelazh-skoba-g2130": C("takelazh-skoba-g2130"),
  "takelazh-skoba-g2150": C("takelazh-skoba-g2150"),
  "takelazh-soedinitel-tsepi": C("takelazh-soedinitel-tsepi"),
  "takelazh-talrep-1478": C("takelazh-talrep-1478"),
  "takelazh-talrep-1480-kk": C("takelazh-talrep-1480-kk"),
  "takelazh-talrep-1480-kryuk-k": C("takelazh-talrep-1480-kryuk-k"),
  "takelazh-talrep-1480-kryuk-kryuk": C("talrep"),
  "takelazh-tros-din3055": C("takelazh-tros-din3055"),
  "takelazh-tros-din3055-pvkh": C("takelazh-tros-din3055-pvkh"),
  "takelazh-tsep-din763": C("takelazh-tsep-din763"),
  "takelazh-tsep-din766": C("tsep"),
  // Канаты
  "kanat-din3059": C("kanat-din3059"),
  "kanat-gost2688": C("kanat-gost2688"),
  "kanat-gost7668": C("kanat-gost7668"),
  // Вентиляция
  "ventil-profil-l": C("ventil-profil-l"),
  "ventil-profil-u": C("ventil-profil-u"),
  "ventil-skoba-flantsev": C("ventil-skoba-flantsev"),
  "ventil-strubtsiny": C("perfo"),
  "ventil-traversa": C("ventil-traversa"),
  "ventil-trubki-kflex": C("ventil-trubki-kflex"),
  "ventil-ugolok": C("ventil-ugolok"),
  "ventil-khomut": C("ventil-khomut"),
  "ventil-shina": C("ventil-shina"),
  "ventil-shpilka": C("ventil-shpilka"),
  // Перфо (реальные фото bugel.kz по подтипам)
  "perfo-derzhatel-balki": C("perfo-derzhatel-balki"),
  "perfo-plastina-kp": C("perfo-plastina-kp"),
  "perfo-ankernyi-ugol-kau": C("perfo-ankernyi-ugol-kau"),
  "perfo-ugol-ku": C("perfo-ugol-ku"),
  "perfo-ugol-kuas": C("perfo-ugol-kuas"),
  "perfo-ugol-kus": C("perfo-ugol-kus"),
  "perfo-ugol-kur": C("perfo-ugol-kur"),
  "perfo-ugol-kuu": C("perfo-ugol-kuu"),
  "perfo-ugol-kur-us": C("perfo-ugol-kur-us"),
  "perfo-lenta": C("perfo-lenta"),
  "perfo-opora-balki": C("perfo-opora-balki"),
  "perfo-lenta-lm": C("perfo-lenta"),
  "perfo-plastina-ps": C("perfo-plastina-ps"),
  "perfo-prushina-pzp": C("perfo-prushina-pzp"),
  "perfo-uglovoy-soedinitel": C("perfo"),
  "perfo-ugol-mebelnyi": C("perfo-ugol-mebelnyi"),
  // Электроды
  "svarka-lez": C("svarka-lez"),
  "svarka-monolith": C("svarka-monolith"),
  "svarka-rossiya": C("svarka"),
  "svarka-kitay": C("svarka-kitay"),
  "svarka-prinadlezhnosti": C("svarka"),
  // Шланги
  "shlangi-armirovannyi": C("shlangi-armirovannyi"),
  "shlangi-mbs": C("shlangi-mbs"),
  "shlangi-polivochnyi": C("shlangi-polivochnyi"),
};

// Картинки групп — для hero страницы группы
export const GROUP_IMAGES: Record<string, string> = {
  krepezh: C("bolty"),
  nerzhaveyushchiy: C("nerzhav"),
  takelazh: C("talrep"),
  kanaty: C("kanat"),
  ventilatsiya: C("ventil"),
  perfo: C("perfo"),
  elektrody: C("elektrody"),
};

export function getCategoryImage(slug: string): string | undefined {
  return CATEGORY_IMAGES[slug] || GROUP_IMAGES[slug];
}

// тёмный градиент слева направо поверх картинки (текст читаем слева, фото справа);
// без картинки — прежний паттерн из точек
export function heroBg(img?: string): CSSProperties {
  if (!img) {
    return {
      backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.04) 1px, transparent 1px)",
      backgroundSize: "28px 28px",
    };
  }
  return {
    backgroundImage: `linear-gradient(to right, rgba(15,23,42,0.97) 0%, rgba(15,23,42,0.9) 38%, rgba(15,23,42,0.4) 72%, rgba(15,23,42,0.12) 100%), url('${img}')`,
    backgroundSize: "cover",
    backgroundPosition: "right center",
  };
}

// светлый вариант для контентных карточек: тёмный текст слева читаем, фото проступает справа
export function cardBg(img?: string): CSSProperties {
  if (!img) return {};
  return {
    backgroundImage: `linear-gradient(to right, rgba(255,255,255,1) 0%, rgba(255,255,255,0.99) 48%, rgba(255,255,255,0.65) 72%, rgba(255,255,255,0.25) 100%), url('${img}')`,
    backgroundSize: "cover",
    backgroundPosition: "right center",
  };
}
