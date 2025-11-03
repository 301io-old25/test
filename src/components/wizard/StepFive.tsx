'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import {
  ArrowLeft,
  Download,
  Send,
  Check,
  X,
  Plus,
  Mail,
  FileText
} from 'lucide-react';

interface StepFiveProps {
  onPrevious: () => void;
  onComplete: (data?: any) => void;
  stepData?: {
    workflowTitle: string;
    documentType: string;
    method: string;
    generatedContent?: string;
    sections?: any[];
  };
}

interface EmailRecipient {
  id: string;
  email: string;
}

export default function StepFive({
  onPrevious,
  onComplete,
  stepData
}: StepFiveProps) {
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [toEmails, setToEmails] = useState<EmailRecipient[]>([
    { id: '1', email: 'client@company.com' }
  ]);
  const [ccEmails, setCcEmails] = useState<EmailRecipient[]>([]);
  const [emailSubject, setEmailSubject] = useState(
    `Final ${stepData?.documentType} - ${stepData?.workflowTitle}`
  );
  const [emailBody, setEmailBody] = useState(
    `Dear Team,\n\nPlease find attached the final ${stepData?.documentType} document for your records.\n\nBest regards,\nAdmin`
  );
  const [isSending, setIsSending] = useState(false);

  // Consolidated document content
  const consolidatedDocument = `**MASTER SERVICE AGREEMENT**

This Master Service Agreement ("Agreement") is executed as of [Effective Date] ("Effective Date"), by and between [Client Name], whose principal place of business is located at [Client Address] ("Client"), and [Service Provider Name], whose principal place of business is located at [Service Provider Address] ("Service Provider"). The Client and the Service Provider may be individually referred to as a "Party" and collectively as the "Parties."

---

**1. Scope of Services**

1.1 **Services**: The Service Provider hereby commits to deliver the services delineated in the applicable Statements of Work ("SOW") duly executed by both Parties, which shall be annexed hereto and incorporated by reference.

---

**2. Term and Termination**

2.1 **Term**: This Agreement shall commence on the Effective Date and shall remain in effect until terminated in accordance with the provisions herein.

---

**3. Payment Terms**

3.1 **Fees**: Client shall pay Service Provider the fees as specified in the applicable SOW. All invoices are due within 30 days of receipt.

3.2 **Late Payment**: Late payments shall accrue interest at the rate of 1.5% per month.

---

**4. Confidentiality**

4.1 **Obligation**: Each party shall maintain the confidentiality of all proprietary information received from the other party.

---

**5. Intellectual Property**

5.1 **Ownership**: Service Provider retains all pre-existing intellectual property rights.

---

**6. Limitation of Liability**

6.1 **Cap**: Neither party's liability shall exceed the total fees paid under this Agreement.

---

**7. General Provisions**

7.1 **Governing Law**: This Agreement shall be governed by the laws of [State/Country].

IN WITNESS WHEREOF, the parties have executed this Agreement as of the Effective Date.

_____________________________
[Client Name]
By: _________________________
Title: ______________________

_____________________________
[Service Provider Name]
By: _________________________
Title: ______________________`;

  const handleDownload = () => {
    // Create a blob with the document content
    const blob = new Blob([consolidatedDocument], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${stepData?.workflowTitle || 'document'}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast.success('Document downloaded successfully!');
  };

  const handleApprove = () => {
    toast.success('Document approved and workflow completed!');
    onComplete({
      status: 'approved',
      document: consolidatedDocument,
      timestamp: new Date().toISOString()
    });
  };

  const addEmail = (type: 'to' | 'cc') => {
    const newEmail = { id: Date.now().toString(), email: '' };
    if (type === 'to') {
      setToEmails([...toEmails, newEmail]);
    } else {
      setCcEmails([...ccEmails, newEmail]);
    }
  };

  const updateEmail = (type: 'to' | 'cc', id: string, email: string) => {
    if (type === 'to') {
      setToEmails(
        toEmails.map((recipient) =>
          recipient.id === id ? { ...recipient, email } : recipient
        )
      );
    } else {
      setCcEmails(
        ccEmails.map((recipient) =>
          recipient.id === id ? { ...recipient, email } : recipient
        )
      );
    }
  };

  const removeEmail = (type: 'to' | 'cc', id: string) => {
    if (type === 'to') {
      setToEmails(toEmails.filter((recipient) => recipient.id !== id));
    } else {
      setCcEmails(ccEmails.filter((recipient) => recipient.id !== id));
    }
  };

  const handleSendEmail = async () => {
    // Validate emails
    const invalidToEmails = toEmails.filter(
      (recipient) => !recipient.email || !isValidEmail(recipient.email)
    );
    const invalidCcEmails = ccEmails.filter(
      (recipient) => !recipient.email || !isValidEmail(recipient.email)
    );

    if (invalidToEmails.length > 0 || invalidCcEmails.length > 0) {
      toast.error('Please enter valid email addresses');
      return;
    }

    if (toEmails.length === 0) {
      toast.error('Please add at least one recipient in To field');
      return;
    }

    setIsSending(true);

    // Simulate email sending
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Mock email sending logic
      console.log('Sending email with details:', {
        to: toEmails,
        cc: ccEmails,
        subject: emailSubject,
        body: emailBody,
        attachment: consolidatedDocument
      });

      toast.success('Email sent successfully!');
      setShowEmailModal(false);

      // Reset form
      setToEmails([{ id: '1', email: 'client@company.com' }]);
      setCcEmails([]);
      setEmailSubject(
        `Final ${stepData?.documentType} - ${stepData?.workflowTitle}`
      );
      setEmailBody(
        `Dear Team,\n\nPlease find attached the final ${stepData?.documentType} document for your records.\n\nBest regards,\nAdmin`
      );
    } catch (error) {
      toast.error('Failed to send email. Please try again.');
    } finally {
      setIsSending(false);
    }
  };

  const isValidEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  return (
    <div className='flex w-full justify-center bg-white'>
      {/* Email Modal */}
      {showEmailModal && (
        <div className='bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center bg-black'>
          <div className='max-h-[90vh] w-11/12 max-w-4xl overflow-hidden rounded-lg bg-white shadow-xl'>
            <div className='flex items-center justify-between border-b p-6'>
              <h3 className='flex items-center gap-2 text-lg font-semibold'>
                <Mail className='h-5 w-5' />
                Send Document as Attachment
              </h3>
              <Button
                variant='ghost'
                size='sm'
                onClick={() => setShowEmailModal(false)}
                className='h-8 w-8 cursor-pointer p-0'
              >
                <X className='h-4 w-4' />
              </Button>
            </div>

            <div className='max-h-[calc(90vh-180px)] space-y-4 overflow-y-auto p-6'>
              {/* To Field */}
              <div className='space-y-2'>
                <Label htmlFor='to-emails' className='text-sm font-medium'>
                  To:
                </Label>
                <div className='space-y-2'>
                  {toEmails.map((recipient) => (
                    <div key={recipient.id} className='flex gap-2'>
                      <Input
                        type='email'
                        value={recipient.email}
                        onChange={(e) =>
                          updateEmail('to', recipient.id, e.target.value)
                        }
                        placeholder='recipient@example.com'
                        className='flex-1'
                      />
                      <Button
                        type='button'
                        variant='outline'
                        size='sm'
                        onClick={() => removeEmail('to', recipient.id)}
                        className='cursor-pointer'
                        disabled={toEmails.length === 1}
                      >
                        <X className='h-4 w-4' />
                      </Button>
                    </div>
                  ))}
                  <Button
                    type='button'
                    variant='outline'
                    size='sm'
                    onClick={() => addEmail('to')}
                    className='flex cursor-pointer items-center gap-1'
                  >
                    <Plus className='h-4 w-4' />
                    Add Recipient
                  </Button>
                </div>
              </div>

              {/* CC Field */}
              <div className='space-y-2'>
                <Label htmlFor='cc-emails' className='text-sm font-medium'>
                  CC:
                </Label>
                <div className='space-y-2'>
                  {ccEmails.map((recipient) => (
                    <div key={recipient.id} className='flex gap-2'>
                      <Input
                        type='email'
                        value={recipient.email}
                        onChange={(e) =>
                          updateEmail('cc', recipient.id, e.target.value)
                        }
                        placeholder='cc@example.com'
                        className='flex-1'
                      />
                      <Button
                        type='button'
                        variant='outline'
                        size='sm'
                        className='cursor-pointer'
                        onClick={() => removeEmail('cc', recipient.id)}
                      >
                        <X className='h-4 w-4' />
                      </Button>
                    </div>
                  ))}
                  <Button
                    type='button'
                    variant='outline'
                    size='sm'
                    onClick={() => addEmail('cc')}
                    className='flex cursor-pointer items-center gap-1'
                  >
                    <Plus className='h-4 w-4' />
                    Add CC
                  </Button>
                </div>
              </div>

              {/* Subject */}
              <div className='space-y-2'>
                <Label htmlFor='email-subject' className='text-sm font-medium'>
                  Subject:
                </Label>
                <Input
                  id='email-subject'
                  value={emailSubject}
                  onChange={(e) => setEmailSubject(e.target.value)}
                  placeholder='Email subject'
                />
              </div>

              {/* Email Body */}
              <div className='space-y-2'>
                <Label htmlFor='email-body' className='text-sm font-medium'>
                  Message:
                </Label>
                <Textarea
                  id='email-body'
                  value={emailBody}
                  onChange={(e) => setEmailBody(e.target.value)}
                  placeholder='Enter your message here...'
                  className='min-h-[150px] resize-none'
                />
              </div>

              {/* Attachment Preview */}
              <div className='space-y-2'>
                <Label className='text-sm font-medium'>Attachment:</Label>
                <Card className='border-dashed bg-gray-50'>
                  <CardContent className='px-3'>
                    <div className='flex items-center justify-between'>
                      <div className='flex items-center gap-2'>
                        <FileText className='h-4 w-4 text-gray-500' />
                        <span className='text-sm font-medium'>
                          {stepData?.workflowTitle || 'document'}.pdf
                        </span>
                      </div>
                      <Badge variant='secondary' className='text-xs'>
                        PDF Document
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            <div className='flex justify-end gap-3 border-t p-6'>
              <Button
                variant='outline'
                onClick={() => setShowEmailModal(false)}
                className='cursor-pointer'
                disabled={isSending}
              >
                Cancel
              </Button>
              <Button
                onClick={handleSendEmail}
                disabled={isSending}
                className='flex cursor-pointer items-center gap-2'
              >
                {isSending ? (
                  <>
                    <div className='h-4 w-4 animate-spin rounded-full border-b-2 border-white' />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className='h-4 w-4' />
                    Send Email
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      )}

      <Card className='w-full rounded-2xl shadow-md'>
        <CardContent className='space-y-3 px-6'>
          {/* Header */}
          <div className='space-y-2'>
            <div className='flex items-center justify-between'>
              <div>
                <h3 className='text-xl font-semibold'>
                  Final Approval & Export - {stepData?.workflowTitle}
                </h3>
                {stepData && (
                  <p className='text-muted-foreground text-sm'>
                    Document: <strong>{stepData.documentType}</strong>
                    {stepData.workflowTitle && (
                      <>
                        {' '}
                        | Workflow: <strong>{stepData.workflowTitle}</strong>
                      </>
                    )}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Consolidated Document Preview */}
          <div className='space-y-2'>
            <div className='flex items-center justify-between'>
              <h3 className='text-md font-semibold'>
                Consolidated Document Preview
              </h3>
              <Badge
                variant='secondary'
                className='bg-green-100 text-green-800'
              >
                Ready for Export
              </Badge>
            </div>

            <Card className='border-2'>
              <CardContent className='px-6'>
                <div className='prose max-h-[500px] overflow-auto'>
                  <pre className='font-sans text-sm whitespace-pre-wrap text-gray-800'>
                    {consolidatedDocument}
                  </pre>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Action Buttons */}
          <div className='grid grid-cols-1 gap-4 pt-3 md:grid-cols-3'>
            <Button
              onClick={handleDownload}
              variant='outline'
              className='flex cursor-pointer flex-row items-center justify-center gap-2'
            >
              <Download className='h-5 w-5' />
              <span>Download Document</span>
            </Button>

            <Button
              onClick={() => setShowEmailModal(true)}
              variant='outline'
              className='flex cursor-pointer flex-row items-center justify-center gap-2'
            >
              <Send className='h-5 w-5' />
              <span>Send as Attachment</span>
            </Button>

            <div className='space-y-2'>
              <Button
                onClick={handleApprove}
                className='flex w-full cursor-pointer flex-row items-center justify-center gap-2 bg-green-600 hover:bg-green-700'
              >
                <Check className='h-5 w-5' />
                <span>Approve & Close Workflow</span>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
