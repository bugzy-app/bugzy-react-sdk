export interface BugzyComponentProps {
  isOpen: boolean;
  onClose?: (x?: any) => any;
  setOpen?: (isOpen: boolean) => any;
}