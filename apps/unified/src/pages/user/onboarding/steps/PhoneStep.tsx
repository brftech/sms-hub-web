import { useState } from 'react'
import { useHub, Button, Card, CardContent, CardDescription, CardHeader, CardTitle } from '@sms-hub/ui'
import { Input, Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@sms-hub/ui'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@sms-hub/ui'
import { Alert, AlertDescription } from '@sms-hub/ui'
import { StepComponentProps } from '@sms-hub/types'
import { useForm } from 'react-hook-form'
import { Phone, ChevronRight, MapPin, Search, Info, CheckCircle, AlertCircle } from 'lucide-react'
import styled from 'styled-components'

const SearchSection = styled.div`
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 1.5rem;
  margin-bottom: 2rem;
`

const PhoneNumberGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1rem;
  margin-top: 1.5rem;
`

const PhoneCard = styled.div<{ $selected: boolean }>`
  background: ${props => props.$selected ? '#eff6ff' : '#ffffff'};
  border: 2px solid ${props => props.$selected ? '#3b82f6' : '#e5e7eb'};
  border-radius: 8px;
  padding: 1rem;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    border-color: #3b82f6;
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0,0,0,0.1);
  }
`

const PhoneNumber = styled.div`
  font-size: 1.125rem;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 0.5rem;
  font-family: monospace;
`

const PhoneDetails = styled.div`
  font-size: 0.875rem;
  color: #6b7280;
  display: flex;
  align-items: center;
  gap: 0.25rem;
`

const PhonePrice = styled.div`
  font-size: 0.875rem;
  font-weight: 600;
  color: #059669;
  margin-top: 0.5rem;
`

const SelectedPhoneSection = styled.div`
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(118, 75, 162, 0.05) 100%);
  border: 2px solid #667eea;
  border-radius: 8px;
  padding: 1.5rem;
  margin: 2rem 0;
`

const LoadingState = styled.div`
  text-align: center;
  padding: 2rem;
  color: #6b7280;
`

const InfoBox = styled.div`
  background: #fef3c7;
  border: 1px solid #f59e0b;
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 1.5rem;
  display: flex;
  gap: 0.75rem;
`

const InfoIcon = styled.div`
  color: #f59e0b;
  flex-shrink: 0;
`

const InfoText = styled.div`
  font-size: 0.875rem;
  color: #92400e;
  line-height: 1.5;
`

interface PhoneFormData {
  area_code: string
  state: string
  phone_type: string
  selected_number: string
}

interface AvailablePhoneNumber {
  phoneNumber: string
  city: string
  state: string
  lata: string
  rateCenter: string
  price: number
  capabilities: {
    sms: boolean
    mms: boolean
    voice: boolean
  }
}

const US_STATES = [
  { value: 'AL', label: 'Alabama' },
  { value: 'AK', label: 'Alaska' },
  { value: 'AZ', label: 'Arizona' },
  { value: 'AR', label: 'Arkansas' },
  { value: 'CA', label: 'California' },
  { value: 'CO', label: 'Colorado' },
  { value: 'CT', label: 'Connecticut' },
  { value: 'DE', label: 'Delaware' },
  { value: 'FL', label: 'Florida' },
  { value: 'GA', label: 'Georgia' },
  // Add more states as needed
]

export function PhoneStep({ onComplete }: StepComponentProps) {
  const { hubConfig } = useHub()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSearching, setIsSearching] = useState(false)
  const [availableNumbers, setAvailableNumbers] = useState<AvailablePhoneNumber[]>([])
  const [selectedNumber, setSelectedNumber] = useState<AvailablePhoneNumber | null>(null)

  const form = useForm<PhoneFormData>({
    defaultValues: {
      area_code: '',
      state: '',
      phone_type: 'local',
      selected_number: ''
    }
  })

  const searchPhoneNumbers = async () => {
    setIsSearching(true)
    const { area_code, state } = form.getValues()
    
    try {
      // In development, return mock data
      // In production, this would call Bandwidth API
      const mockNumbers: AvailablePhoneNumber[] = [
        {
          phoneNumber: `+1${area_code || '415'}5551234`,
          city: 'San Francisco',
          state: state || 'CA',
          lata: '722',
          rateCenter: 'SANFRANCISCO',
          price: 1.50,
          capabilities: { sms: true, mms: true, voice: true }
        },
        {
          phoneNumber: `+1${area_code || '415'}5555678`,
          city: 'San Francisco',
          state: state || 'CA',
          lata: '722',
          rateCenter: 'SANFRANCISCO',
          price: 1.50,
          capabilities: { sms: true, mms: true, voice: true }
        },
        {
          phoneNumber: `+1${area_code || '415'}5559012`,
          city: 'San Francisco',
          state: state || 'CA',
          lata: '722',
          rateCenter: 'SANFRANCISCO',
          price: 2.00,
          capabilities: { sms: true, mms: true, voice: true }
        },
        {
          phoneNumber: `+1${area_code || '415'}5553456`,
          city: 'San Francisco',
          state: state || 'CA',
          lata: '722',
          rateCenter: 'SANFRANCISCO',
          price: 1.50,
          capabilities: { sms: true, mms: true, voice: true }
        }
      ]
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1500))
      setAvailableNumbers(mockNumbers)
    } catch (error) {
      console.error('Error searching phone numbers:', error)
    } finally {
      setIsSearching(false)
    }
  }

  const onSubmit = async (data: PhoneFormData) => {
    if (!selectedNumber) {
      return
    }
    
    setIsSubmitting(true)
    
    try {
      // Provision the selected phone number
      const phoneData = {
        ...data,
        selected_number: selectedNumber.phoneNumber,
        city: selectedNumber.city,
        state: selectedNumber.state,
        price: selectedNumber.price,
        capabilities: selectedNumber.capabilities,
        hub_id: hubConfig.hubNumber,
        provisioned_at: new Date().toISOString()
      }
      
      // TODO: Call Bandwidth API to provision the number
      await onComplete(phoneData)
    } catch (error) {
      console.error('Phone provisioning error:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const formatPhoneDisplay = (phone: string) => {
    const cleaned = phone.replace(/\D/g, '')
    const match = cleaned.match(/^1?(\d{3})(\d{3})(\d{4})$/)
    if (match) {
      return `(${match[1]}) ${match[2]}-${match[3]}`
    }
    return phone
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Phone className="w-5 h-5 mr-2 hub-text-primary" />
          Phone Number Provisioning
        </CardTitle>
        <CardDescription>
          Select and provision a dedicated phone number for SMS messaging
        </CardDescription>
      </CardHeader>
      <CardContent>
        <InfoBox>
          <InfoIcon>
            <Info className="w-5 h-5" />
          </InfoIcon>
          <InfoText>
            Your phone number will be registered with your approved campaign. All messages sent through {hubConfig.displayName}
            will originate from this number. You can add additional numbers later.
          </InfoText>
        </InfoBox>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <SearchSection>
              <h3 className="font-semibold mb-4">Search Available Numbers</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="area_code"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Area Code (Optional)</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="415" 
                          maxLength={3}
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="state"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>State</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select state" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {US_STATES.map(state => (
                            <SelectItem key={state.value} value={state.value}>
                              {state.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="phone_type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Number Type</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="local">Local</SelectItem>
                          <SelectItem value="tollfree">Toll-Free</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <Button
                type="button"
                onClick={searchPhoneNumbers}
                disabled={isSearching}
                className="mt-4"
                variant="outline"
              >
                <Search className="w-4 h-4 mr-2" />
                {isSearching ? 'Searching...' : 'Search Numbers'}
              </Button>
            </SearchSection>

            {isSearching && (
              <LoadingState>
                Searching for available phone numbers...
              </LoadingState>
            )}

            {availableNumbers.length > 0 && (
              <>
                <h3 className="font-semibold">Available Numbers</h3>
                <PhoneNumberGrid>
                  {availableNumbers.map((number) => (
                    <PhoneCard
                      key={number.phoneNumber}
                      $selected={selectedNumber?.phoneNumber === number.phoneNumber}
                      onClick={() => setSelectedNumber(number)}
                    >
                      <PhoneNumber>{formatPhoneDisplay(number.phoneNumber)}</PhoneNumber>
                      <PhoneDetails>
                        <MapPin className="w-3 h-3" />
                        {number.city}, {number.state}
                      </PhoneDetails>
                      <PhonePrice>${number.price.toFixed(2)}/month</PhonePrice>
                      {selectedNumber?.phoneNumber === number.phoneNumber && (
                        <CheckCircle className="w-5 h-5 text-blue-600 mt-2" />
                      )}
                    </PhoneCard>
                  ))}
                </PhoneNumberGrid>
              </>
            )}

            {selectedNumber && (
              <SelectedPhoneSection>
                <h3 className="font-semibold mb-2">Selected Number</h3>
                <PhoneNumber>{formatPhoneDisplay(selectedNumber.phoneNumber)}</PhoneNumber>
                <p className="text-sm text-gray-600 mt-1">
                  {selectedNumber.city}, {selectedNumber.state} • ${selectedNumber.price.toFixed(2)}/month
                </p>
                <div className="mt-3 flex gap-2">
                  {selectedNumber.capabilities.sms && (
                    <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded">SMS</span>
                  )}
                  {selectedNumber.capabilities.mms && (
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">MMS</span>
                  )}
                  {selectedNumber.capabilities.voice && (
                    <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded">Voice</span>
                  )}
                </div>
              </SelectedPhoneSection>
            )}

            {!selectedNumber && availableNumbers.length > 0 && (
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Please select a phone number to continue
                </AlertDescription>
              </Alert>
            )}

            <div className="flex justify-end pt-4">
              <Button 
                type="submit" 
                className="hub-bg-primary hover:hub-bg-primary/90"
                disabled={!selectedNumber || isSubmitting}
              >
                {isSubmitting ? 'Provisioning...' : 'Provision Number'}
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}