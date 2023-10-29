export interface BugzyComponentProps {
  isOpen: boolean;
  onClose?: (x?: any) => any;
  setOpen?: (isOpen: boolean) => any;
  userEmail?: string;
  customMetaData?: { [key: string]: any };
  projectID: string;
}
