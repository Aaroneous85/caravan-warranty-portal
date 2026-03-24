export type Claim = {
  id: string;
  claimNumber: string;
  customerName: string;
  vanModel: string;
  issue: string;
  status: "New" | "In Review" | "Approved" | "Rejected";
  createdAt: string;
};

export const mockClaims: Claim[] = [
  {
    id: "1",
    claimNumber: "DC10001",
    customerName: "John Smith",
    vanModel: "Musketeer Palace",
    issue: "Water pump noise",
    status: "In Review",
    createdAt: "2026-03-20",
  },
  {
    id: "2",
    claimNumber: "DC10002",
    customerName: "Sarah Jones",
    vanModel: "Excalibur Prince",
    issue: "Window not sealing",
    status: "Approved",
    createdAt: "2026-03-19",
  },
  {
    id: "3",
    claimNumber: "DC10003",
    customerName: "Michael Brown",
    vanModel: "Gladiator",
    issue: "Front boot latch damage",
    status: "Rejected",
    createdAt: "2026-03-18",
  },
];