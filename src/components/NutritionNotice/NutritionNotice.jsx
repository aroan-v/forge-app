import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Info } from 'lucide-react'

export function NutritionNotice() {
  return (
    <Alert className="w-md">
      <Info className="h-4 w-4" />
      <AlertTitle className="font-semibold">Important Notice</AlertTitle>
      <AlertDescription>
        <ul className="list-disc space-y-1 pl-5 text-sm">
          <li>
            <span className="font-medium">Default Unit:</span> If you don't provide a unit, the
            system will use <code className="font-bold">g (grams)</code>.
          </li>
          <li>
            <span className="font-medium">Custom Units:</span> You can use your own units, such as{' '}
            <code className="font-bold">3 pcs eggs</code> or{' '}
            <code className="font-bold">1 gallon milk</code>.
          </li>
        </ul>
      </AlertDescription>
    </Alert>
  )
}
