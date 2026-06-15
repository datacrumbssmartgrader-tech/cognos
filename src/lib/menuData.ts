export interface Extra { label: string; price: number; }
export interface MenuItem {
  id: string;
  name: string;
  desc: string;
  price: number;
  cat: string;
  img: string;
  tags?: string[];
  extras?: Extra[];
  hidden?: boolean;
  prepTime?: number;
}

export const MENU: MenuItem[] = [];
