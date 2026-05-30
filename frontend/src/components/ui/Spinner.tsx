import { ReloadIcon } from "@radix-ui/react-icons";

type Props = {
  className?: string
}

export default function Spinner({ className }: Props) {
  return (
    <ReloadIcon
      className={`animate-spin inline ${className}`}
    />
  )
}