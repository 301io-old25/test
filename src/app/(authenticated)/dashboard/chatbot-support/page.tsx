'use client';

import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  MessageCircle,
  FileText,
  Sparkles,
  ThumbsUp,
  ThumbsDown,
  ChevronRight
} from 'lucide-react';
import PageContainer from '@/components/layout/page-container';

interface Question {
  id: number;
  title: string;
  icon: string;
  answer: string;
}

const ChatBotSupport = () => {
  const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(
    null
  );
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const frequentQuestions: Question[] = [
    {
      id: 1,
      title: 'Used two sessions under ABC. Can I book another?',
      icon: '📊',
      answer:
        "Based on the company's EAP agreement, your allocation for legal support has been reached. Additional sessions can still be booked on a self-funded basis at a discounted rate."
    },
    {
      id: 2,
      title: 'Can I book both coaching & counselling under XYZ Finance?',
      icon: '📅',
      answer:
        "Yes. Your organization's retainer contract allows employees to access multiple service streams. Coaching and counselling sessions are treated separately and can be used concurrently."
    },
    {
      id: 3,
      title: 'Can dependents access EAP under BrightGov?',
      icon: '👥',
      answer:
        'Yes. Dependents are eligible for support sessions under the government contract. Each dependent may access up to two wellbeing sessions per calendar year.'
    },
    {
      id: 4,
      title: 'Are wellbeing webinars included in our NovaTech contract?',
      icon: '🔄',
      answer:
        'Yes. Under your Custom Corporate Wellbeing Plan, quarterly webinars are included as part of the engagement package. Additional webinars can be arranged at the standard corporate rate.'
    }
  ];

  const handleQuestionSelect = (question: Question) => {
    setSelectedQuestion(question);
  };

  const handleGenerateDocument = () => {
    if (!prompt.trim()) return;

    setIsGenerating(true);
    // Simulate API call
    setTimeout(() => {
      setIsGenerating(false);
      // Handle successful generation
      alert('Document generated successfully!');
    }, 2000);
  };

  return (
    <PageContainer scrollable={false}>
      <div className='min-h-screen'>
        <div className='mx-auto'>
          {/* Header */}
          <div className='mb-8'>
            <h1 className='mb-2 bg-clip-text text-4xl font-bold text-black'>
              Document Management
            </h1>
            <div className='flex items-center gap-2'>
              <Sparkles className='h-5 w-5 text-[#00A345]' />
              <p className='text-lg text-slate-600'>
                AI Decision Support Agent
              </p>
            </div>
          </div>

          <div className='flex flex-col gap-4'>
            {/* Left Column - AI Assistant */}
            <Card className='border-0 shadow-lg'>
              <CardHeader className='pb-4'>
                <div className='flex items-center gap-2'>
                  <div className='rounded-lg bg-blue-100 p-2'>
                    <MessageCircle className='h-6 w-6 text-[#00A345]' />
                  </div>
                  <div>
                    <CardTitle className='text-xl'>
                      Ask a Question About Your Documents
                    </CardTitle>
                    <CardDescription>
                      I am your AI Assistant. Select a frequent question or ask
                      your own.
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className='space-y-6'>
                {/* Frequent Questions */}
                <div>
                  <h3 className='mb-3 text-sm font-medium text-slate-700'>
                    Frequent Questions
                  </h3>
                  <div className='grid grid-cols-2 gap-3'>
                    {frequentQuestions.map((question) => (
                      <Button
                        key={question.id}
                        variant={
                          selectedQuestion?.id === question.id
                            ? 'default'
                            : 'outline'
                        }
                        className='h-auto cursor-pointer justify-start px-4 py-3'
                        onClick={() => handleQuestionSelect(question)}
                      >
                        <span className='mr-2'>{question.icon}</span>
                        <span className='text-sm'>{question.title}</span>
                      </Button>
                    ))}
                  </div>
                </div>

                {/* AI Response Area */}
                {selectedQuestion && (
                  <div className='rounded-lg border bg-slate-50 p-4'>
                    <div className='mb-3 flex items-start justify-between'>
                      <Badge variant='secondary' className='mb-2'>
                        AI Response
                      </Badge>
                      <div className='flex gap-1'>
                        <Button variant='ghost' size='sm'>
                          <ThumbsUp className='h-4 w-4' />
                        </Button>
                        <Button variant='ghost' size='sm'>
                          <ThumbsDown className='h-4 w-4' />
                        </Button>
                      </div>
                    </div>
                    <p className='text-sm text-slate-700'>
                      {selectedQuestion.answer}
                    </p>
                  </div>
                )}
                {/* Custom Question */}
                <div>
                  <h3 className='mb-3 text-sm font-medium text-slate-700'>
                    Ask Your Own Question
                  </h3>
                  <div className='flex gap-2'>
                    <Textarea
                      placeholder='Type your question here...'
                      className='min-h-[80px] resize-none'
                    />
                  </div>
                  <Button className='mt-3 w-full cursor-pointer'>
                    <MessageCircle className='mr-2 h-4 w-4' />
                    Ask AI Assistant
                  </Button>
                </div>

                {/* Different Question Link */}
                <div className='text-center'>
                  <Button variant='link' className='text-[#00A345]'>
                    Have a different question?{' '}
                    <ChevronRight className='ml-1 h-4 w-4' />
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Right Column - Document Generation */}
            <Card className='border-0 shadow-lg'>
              <CardHeader className='pb-4'>
                <div className='flex items-center gap-2'>
                  <div className='rounded-lg bg-purple-100 p-2'>
                    <FileText className='h-6 w-6 text-purple-600' />
                  </div>
                  <div>
                    <CardTitle className='text-xl'>
                      Generate New Document from Existing Content
                    </CardTitle>
                    <CardDescription>
                      Create new documents using AI based on your existing
                      content
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className='space-y-6'>
                {/* Prompt Input */}
                <div>
                  <h3 className='mb-3 text-sm font-medium text-slate-700'>
                    Your Prompt for New Document
                  </h3>
                  <Textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder='e.g., Generate a summary of all compliance clauses from the uploaded contracts, focusing on data privacy and security. Include an introduction and conclusion.'
                    className='min-h-[120px] resize-none'
                  />
                  <div className='mt-2 flex items-center justify-between'>
                    <span className='text-xs text-slate-500'>
                      {prompt.length}/500 characters
                    </span>
                    <Button
                      variant='ghost'
                      size='sm'
                      className='cursor-pointer'
                      onClick={() =>
                        setPrompt(
                          'Generate a summary of all compliance clauses from the uploaded contracts, focusing on data privacy and security. Include an introduction and conclusion.'
                        )
                      }
                    >
                      Use Example
                    </Button>
                  </div>
                </div>

                {/* Document Options */}
                <div>
                  <h3 className='mb-3 text-sm font-medium text-slate-700'>
                    Document Options
                  </h3>
                  <Tabs defaultValue='format' className='w-full'>
                    <TabsList className='grid w-full grid-cols-3'>
                      <TabsTrigger value='format'>Format</TabsTrigger>
                      <TabsTrigger value='tone'>Tone</TabsTrigger>
                      <TabsTrigger value='length'>Length</TabsTrigger>
                    </TabsList>
                    <TabsContent
                      value='format'
                      className='mt-2 rounded-lg border p-3'
                    >
                      <div className='grid grid-cols-2 gap-2'>
                        <Button
                          variant='outline'
                          size='sm'
                          className='cursor-pointer'
                        >
                          Report
                        </Button>
                        <Button
                          variant='outline'
                          size='sm'
                          className='cursor-pointer'
                        >
                          Summary
                        </Button>
                        <Button
                          variant='outline'
                          size='sm'
                          className='cursor-pointer'
                        >
                          Memo
                        </Button>
                        <Button
                          variant='outline'
                          size='sm'
                          className='cursor-pointer'
                        >
                          Email
                        </Button>
                      </div>
                    </TabsContent>
                    <TabsContent
                      value='tone'
                      className='mt-2 rounded-lg border p-3'
                    >
                      <div className='grid grid-cols-2 gap-2'>
                        <Button
                          variant='outline'
                          size='sm'
                          className='cursor-pointer'
                        >
                          Professional
                        </Button>
                        <Button
                          variant='outline'
                          size='sm'
                          className='cursor-pointer'
                        >
                          Casual
                        </Button>
                        <Button
                          variant='outline'
                          size='sm'
                          className='cursor-pointer'
                        >
                          Formal
                        </Button>
                        <Button
                          variant='outline'
                          size='sm'
                          className='cursor-pointer'
                        >
                          Technical
                        </Button>
                      </div>
                    </TabsContent>
                    <TabsContent
                      value='length'
                      className='mt-2 rounded-lg border p-3'
                    >
                      <div className='grid grid-cols-2 gap-2'>
                        <Button
                          variant='outline'
                          size='sm'
                          className='cursor-pointer'
                        >
                          Brief
                        </Button>
                        <Button
                          variant='outline'
                          size='sm'
                          className='cursor-pointer'
                        >
                          Detailed
                        </Button>
                        <Button
                          variant='outline'
                          size='sm'
                          className='cursor-pointer'
                        >
                          Comprehensive
                        </Button>
                      </div>
                    </TabsContent>
                  </Tabs>
                </div>

                {/* Generate Button */}
                <Button
                  className='w-full py-6 text-lg font-medium'
                  disabled={!prompt.trim() || isGenerating}
                  onClick={handleGenerateDocument}
                >
                  {isGenerating ? (
                    <>
                      <div className='mr-2 h-4 w-4 animate-spin rounded-full border-b-2 border-white'></div>
                      Generating Document...
                    </>
                  ) : (
                    <>
                      <Sparkles className='mr-2 h-5 w-5' />
                      Generate Document
                    </>
                  )}
                </Button>

                {/* Recent Documents */}
                <div className='border-t pt-4'>
                  <h3 className='mb-3 text-sm font-medium text-slate-700'>
                    Recent Documents
                  </h3>
                  <div className='space-y-2'>
                    <div className='flex items-center justify-between rounded-lg border p-3'>
                      <div className='flex items-center gap-2'>
                        <FileText className='h-4 w-4 text-slate-500' />
                        <span className='text-sm'>Compliance Summary.pdf</span>
                      </div>
                      <Badge variant='outline'>Today</Badge>
                    </div>
                    <div className='flex items-center justify-between rounded-lg border p-3'>
                      <div className='flex items-center gap-2'>
                        <FileText className='h-4 w-4 text-slate-500' />
                        <span className='text-sm'>Contract Analysis.docx</span>
                      </div>
                      <Badge variant='outline'>Yesterday</Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </PageContainer>
  );
};

export default ChatBotSupport;
