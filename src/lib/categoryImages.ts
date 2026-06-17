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
  "takelazh-vertlyug": C("kryuk"),
  "takelazh-zazim-din741": C("tros"),
  "takelazh-zazim-din3093": C("tros"),
  "takelazh-zazim-dvoinoi": C("tsep"),
  "takelazh-zazim-odinarnyi": C("tsep"),
  "takelazh-karabin-5299c": C("karabin"),
  "takelazh-karabin-5299d": C("karabin"),
  "takelazh-koush-6899b": C("tros"),
  "takelazh-kryuk-320a": C("kryuk"),
  "takelazh-kryuk-s": C("kryuk"),
  "takelazh-rym-bolt": C("kryuk"),
  "takelazh-rym-gayka": C("kryuk"),
  "takelazh-skoba-g209": C("zaklepki"),
  "takelazh-skoba-g2130": C("zaklepki"),
  "takelazh-skoba-g2150": C("zaklepki"),
  "takelazh-soedinitel-tsepi": C("tsep"),
  "takelazh-talrep-1478": C("talrep"),
  "takelazh-talrep-1480-kk": C("talrep"),
  "takelazh-talrep-1480-kryuk-k": C("talrep"),
  "takelazh-talrep-1480-kryuk-kryuk": C("talrep"),
  "takelazh-tros-din3055": C("tros"),
  "takelazh-tros-din3055-pvkh": C("tros"),
  "takelazh-tsep-din763": C("tsep"),
  "takelazh-tsep-din766": C("tsep"),
  // Канаты
  "kanat-din3059": C("kanat"),
  "kanat-gost2688": C("tros"),
  "kanat-gost7668": C("kanat"),
  // Вентиляция
  "ventil-profil-l": C("ventil"),
  "ventil-profil-u": C("ventil"),
  "ventil-skoba-flantsev": C("perfo"),
  "ventil-strubtsiny": C("perfo"),
  "ventil-traversa": C("ventil"),
  "ventil-trubki-kflex": C("ventil"),
  "ventil-ugolok": C("ventil"),
  "ventil-khomut": C("ventil"),
  "ventil-shina": C("ventil"),
  "ventil-shpilka": C("shpilki"),
  // Перфо (реальные фото bugel.kz по подтипам)
  "perfo-derzhatel-balki": C("perfo"),
  "perfo-plastina-kp": C("perfo"),
  "perfo-ankernyi-ugol-kau": C("perfo"),
  "perfo-ugol-ku": C("perfo"),
  "perfo-ugol-kuas": C("perfo"),
  "perfo-ugol-kus": C("perfo"),
  "perfo-ugol-kur": C("perfo"),
  "perfo-ugol-kuu": C("perfo"),
  "perfo-ugol-kur-us": C("perfo"),
  "perfo-lenta": C("perfo"),
  "perfo-opora-balki": C("perfo"),
  "perfo-lenta-lm": C("perfo"),
  "perfo-plastina-ps": C("perfo"),
  "perfo-prushina-pzp": C("perfo"),
  "perfo-uglovoy-soedinitel": C("perfo"),
  "perfo-ugol-mebelnyi": C("perfo"),
  // Электроды
  "svarka-lez": C("elektrody"),
  "svarka-monolith": C("svarka"),
  "svarka-rossiya": C("svarka"),
  "svarka-kitay": C("elektrody"),
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
