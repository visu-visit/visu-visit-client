export type UrlTransition =
  | "Link"
  | "Typed"
  | "Auto_Bookmark"
  | "Auto_Subframe"
  | "Manual_Subframe"
  | "Generated"
  | "Auto_Toplevel"
  | "Form_Submit"
  | "Reload"
  | "Keyword"
  | "Keyword_Generated";

export interface IVisit {
  visitId: number;
  visitTime: string;
  visitUrl: string;
  urlVisitCount: number;
  visitTitle: string | null;
  visitDuration: string;
  lastVisitTime: string;
  transition: UrlTransition;
  fromVisitId: number;
  fromVisitTime: null | string;
  fromVisitUrl: null | string;
  fromVisitTitle: null | string;
}

export interface IPosition {
  vx?: number;
  vy?: number;
  fx?: number;
  fy?: number;
  x?: number;
  y?: number;
}

export interface IDomainNode {
  id?: string;
  domainName: string;
  nanoId?: string;
  position: {
    x: Number;
    y: Number;
  };
  visitCount?: number;
}

export interface IBrowserHistory {
  nanoId: string;
  totalVisits: IVisit[];
  domainNodes: IDomainNode[];
}

export interface IPostHistoryResponse {
  result: string;
  data?: { [key: string]: any };
  error?: { code: number; message: string };
}

export interface IHistoryFormData {
  start: string;
  end: string;
  domain: string;
}

export interface IHistoryLink {
  source: string;
  target: string;
  count: number;
  type: UrlTransition;
}

export interface IHistoryNode extends IPosition {
  id: string;
  visitCount: number;
}

export interface IDirectedGraph<Node, Link> {
  nodes: Node[];
  links: Link[];
}
