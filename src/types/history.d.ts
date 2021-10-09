export interface IHistoryFormData {
  start: string;
  end: string;
  domain?: string;
}

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
  targetUrl: string;
  targetUrlVisitCount: number;
  visitDuration: number;
  visitTime: string;
  transitionType: UrlTransition;
  sourceUrl: null | string;
}

export interface INodePosition {
  vx?: number;
  vy?: number;
  fx?: number;
  fy?: number;
}

export interface IDomainNode extends INodePosition {
  name: string;
  index: number;
  x: number;
  y: number;
  visitCount: number;
  visitDuration: number;
}

export interface IDomainLink {
  source: IDomainNode;
  target: IDomainNode;
  count: number;
  type: UrlTransition;
}

export interface IDirectedGraph<Node, Link> {
  nodes: Node[];
  links: Link[];
}

export interface IBrowserHistory {
  nanoId: string;
  totalVisits: IVisit[] | [];
  domainNodes: IDomainNode[] | [];
}

export interface IPostHistoryResponse {
  result: "ok" | "error";
  data?: IBrowserHistory;
  error?: { code: number; message: string };
}
