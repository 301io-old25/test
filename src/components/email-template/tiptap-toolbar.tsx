'use client';
import React, { useMemo, useCallback } from 'react';
import { Editor } from '@tiptap/react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Separator } from '@/components/ui/separator';
import {
  Undo,
  Redo,
  Bold,
  Italic,
  Underline,
  List,
  ListOrdered,
  ChevronRight,
  ChevronLeft,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Plus,
  Link2,
  Eraser,
  Image,
  Table,
  Minus,
  LayoutGrid,
  Tag
} from 'lucide-react';

const ToolbarDivider = () => (
  <Separator orientation='vertical' className='mx-2 h-7' />
);

interface TiptapToolbarProps {
  editor: Editor | null;
}

const TiptapToolbar = ({ editor }: TiptapToolbarProps) => {
  // --- Memoized state calculation for performance ---
  const activeStyle = useMemo(() => {
    if (!editor) return 'paragraph';
    if (editor.isActive('heading', { level: 1 })) return 'heading1';
    if (editor.isActive('heading', { level: 2 })) return 'heading2';
    if (editor.isActive('heading', { level: 3 })) return 'heading3';
    return 'paragraph';
  }, [editor?.state]);

  const setLink = useCallback(() => {
    if (!editor) return;
    const url = window.prompt('Enter URL:');
    if (url) {
      editor?.chain().focus().setLink({ href: url }).run();
    }
  }, [editor]);

  if (!editor) {
    return null;
  }

  const styleOptions = [
    { label: 'Normal Text', value: 'paragraph' },
    { label: 'Heading 1', value: 'heading1' },
    { label: 'Heading 2', value: 'heading2' },
    { label: 'Heading 3', value: 'heading3' }
  ];

  // --- Handler Functions ---
  const handleStyleChange = (value: string) => {
    switch (value) {
      case 'paragraph':
        editor.chain().focus().setParagraph().run();
        break;
      case 'heading1':
        editor.chain().focus().setHeading({ level: 1 }).run();
        break;
      case 'heading2':
        editor.chain().focus().setHeading({ level: 2 }).run();
        break;
      case 'heading3':
        editor.chain().focus().setHeading({ level: 3 }).run();
        break;
    }
  };

  const insertImage = () => {
    const url = window.prompt('Enter image URL:');
    if (url) editor.chain().focus().setImage({ src: url }).run();
  };

  const insertTable = () => {
    editor
      .chain()
      .focus()
      .insertTable({ rows: 3, cols: 3, withHeaderRow: true })
      .run();
  };

  const insertHorizontalRule = () => {
    editor.chain().focus().setHorizontalRule().run();
  };

  const insertTwoColumns = () => {
    editor
      .chain()
      .focus()
      .insertContent(
        '<table style="width:100%;"><tbody><tr><td style="width:50%; padding:5px; border:1px dashed #ccc;"><p>Col 1</p></td><td style="width:50%; padding:5px; border:1px dashed #ccc;"><p>Col 2</p></td></tr></tbody></table><p></p>'
      )
      .run();
  };

  const insertThreeColumns = () => {
    editor
      .chain()
      .focus()
      .insertContent(
        '<table style="width:100%;"><tbody><tr><td style="width:33.3%; padding:5px; border:1px dashed #ccc;"><p>Col 1</p></td><td style="width:33.3%; padding:5px; border:1px dashed #ccc;"><p>Col 2</p></td><td style="width:33.3%; padding:5px; border:1px dashed #ccc;"><p>Col 3</p></td></tr></tbody></table><p></p>'
      )
      .run();
  };

  const placeholders = [
    { label: 'First Name', value: '{{firstName}}' },
    { label: 'Last Name', value: '{{lastName}}' },
    { label: 'Email', value: '{{email}}' },
    { label: 'Account Name', value: '{{accName}}' },
    { label: 'Start Date', value: '{{startDate}}' },
    { label: 'End Date', value: '{{endDate}}' },
    { label: 'Brand Name', value: '{{brandName}}' },
    { label: 'Vendor Name', value: '{{vendorName}}' },
    { label: 'Evaluation Link', value: '{{evalLink}}' },
    { label: 'Business Unit', value: '{{bu}}' },
    { label: 'Evaluation Period', value: '{{evaluationPeriod}}' },
    { label: 'Country', value: '{{country}}' },
    { label: 'Review Type', value: '{{reviewTypeName}}' },
    { label: 'Evaluation Type', value: '{{evaluationType}}' }
  ];

  return (
    <div className='mb-2 flex flex-wrap items-center gap-2 rounded-t-lg border bg-gray-50 p-2'>
      {/* --- Group: History --- */}
      <div className='flex gap-1'>
        <Button
          variant='ghost'
          size='sm'
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
          title='Undo'
        >
          <Undo className='h-4 w-4' />
        </Button>
        <Button
          variant='ghost'
          size='sm'
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
          title='Redo'
        >
          <Redo className='h-4 w-4' />
        </Button>
      </div>
      <ToolbarDivider />
      {/* --- Group: Styles --- */}
      <Select value={activeStyle} onValueChange={handleStyleChange}>
        <SelectTrigger className='h-9 w-[150px]'>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {styleOptions.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <ToolbarDivider />
      {/* --- Group: Basic Formatting --- */}
      <div className='flex gap-1'>
        <Button
          variant={editor.isActive('bold') ? 'secondary' : 'ghost'}
          size='sm'
          onClick={() => editor.chain().focus().toggleBold().run()}
          title='Bold'
          className='font-bold'
        >
          <Bold className='h-4 w-4' />
        </Button>
        <Button
          variant={editor.isActive('italic') ? 'secondary' : 'ghost'}
          size='sm'
          onClick={() => editor.chain().focus().toggleItalic().run()}
          title='Italic'
          className='italic'
        >
          <Italic className='h-4 w-4' />
        </Button>
        <Button
          variant={editor.isActive('underline') ? 'secondary' : 'ghost'}
          size='sm'
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          title='Underline'
          className='underline'
        >
          <Underline className='h-4 w-4' />
        </Button>
        <Button
          variant={editor.isActive('subscript') ? 'secondary' : 'ghost'}
          size='sm'
          onClick={() => editor.chain().focus().toggleSubscript().run()}
          title='Subscript'
          className='text-sm'
        >
          X<sub className='text-xs'>2</sub>
        </Button>
        <Button
          variant={editor.isActive('superscript') ? 'secondary' : 'ghost'}
          size='sm'
          onClick={() => editor.chain().focus().toggleSuperscript().run()}
          title='Superscript'
          className='text-sm'
        >
          X<sup className='text-xs'>2</sup>
        </Button>
        <Button
          variant={editor.isActive('strike') ? 'secondary' : 'ghost'}
          size='sm'
          onClick={() => editor.chain().focus().toggleStrike().run()}
          title='Strike'
        >
          <del>S</del>
        </Button>
      </div>
      <ToolbarDivider />
      {/* --- Group: Color --- */}
      <div className='flex items-center gap-2'>
        <input
          type='color'
          onInput={(e: React.ChangeEvent<HTMLInputElement>) =>
            editor.chain().focus().setColor(e.target.value).run()
          }
          value={editor.getAttributes('textStyle').color || '#000000'}
          title='Text Color'
          className='h-8 w-8 cursor-pointer rounded border'
        />
        <input
          type='color'
          onInput={(e: React.ChangeEvent<HTMLInputElement>) =>
            editor
              .chain()
              .focus()
              .toggleHighlight({ color: e.target.value })
              .run()
          }
          value={editor.getAttributes('highlight').color || '#ffffff'}
          title='Highlight Color'
          className='h-8 w-8 cursor-pointer rounded border'
        />
      </div>
      <ToolbarDivider />
      {/* --- Group: Lists & Indentation --- */}
      <div className='flex gap-1'>
        <Button
          variant={editor.isActive('bulletList') ? 'secondary' : 'ghost'}
          size='sm'
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          title='Bullet List'
        >
          <List className='h-4 w-4' />
        </Button>
        <Button
          variant={editor.isActive('orderedList') ? 'secondary' : 'ghost'}
          size='sm'
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          title='Numbered List'
        >
          <ListOrdered className='h-4 w-4' />
        </Button>
        <Button
          variant='ghost'
          size='sm'
          onClick={() => editor.chain().focus().sinkListItem('listItem').run()}
          disabled={!editor.can().sinkListItem('listItem')}
          title='Increase Indent'
        >
          <ChevronRight className='h-4 w-4' />
        </Button>
        <Button
          variant='ghost'
          size='sm'
          onClick={() => editor.chain().focus().liftListItem('listItem').run()}
          disabled={!editor.can().liftListItem('listItem')}
          title='Decrease Indent'
        >
          <ChevronLeft className='h-4 w-4' />
        </Button>
      </div>
      <ToolbarDivider />
      {/* --- Group: Alignment --- */}
      <div className='flex gap-1'>
        <Button
          variant={
            editor.isActive({ textAlign: 'left' }) ? 'secondary' : 'ghost'
          }
          size='sm'
          onClick={() => editor.chain().focus().setTextAlign('left').run()}
          title='Align Left'
        >
          <AlignLeft className='h-4 w-4' />
        </Button>
        <Button
          variant={
            editor.isActive({ textAlign: 'center' }) ? 'secondary' : 'ghost'
          }
          size='sm'
          onClick={() => editor.chain().focus().setTextAlign('center').run()}
          title='Align Center'
        >
          <AlignCenter className='h-4 w-4' />
        </Button>
        <Button
          variant={
            editor.isActive({ textAlign: 'right' }) ? 'secondary' : 'ghost'
          }
          size='sm'
          onClick={() => editor.chain().focus().setTextAlign('right').run()}
          title='Align Right'
        >
          <AlignRight className='h-4 w-4' />
        </Button>
      </div>
      <ToolbarDivider />
      {/* --- Group: Insert Menu --- */}
      <div className='flex gap-1'>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant='ghost' size='sm' className='gap-1'>
              <Plus className='h-4 w-4' />
              Insert
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align='start' className='w-56'>
            <DropdownMenuItem onClick={insertImage}>
              <Image className='mr-2 h-4 w-4' />
              Image
            </DropdownMenuItem>
            <DropdownMenuItem onClick={insertTable}>
              <Table className='mr-2 h-4 w-4' />
              Table
            </DropdownMenuItem>
            <DropdownMenuItem onClick={insertHorizontalRule}>
              <Minus className='mr-2 h-4 w-4' />
              Horizontal Divider
            </DropdownMenuItem>
            <DropdownMenuSeparator />

            {/* Layouts Submenu */}
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>
                <LayoutGrid className='mr-2 h-4 w-4' />
                Layouts
              </DropdownMenuSubTrigger>
              <DropdownMenuSubContent>
                <DropdownMenuItem onClick={insertTwoColumns}>
                  Two Columns
                </DropdownMenuItem>
                <DropdownMenuItem onClick={insertThreeColumns}>
                  Three Columns
                </DropdownMenuItem>
              </DropdownMenuSubContent>
            </DropdownMenuSub>

            {/* Placeholders Submenu */}
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>
                <Tag className='mr-2 h-4 w-4' />
                Placeholders
              </DropdownMenuSubTrigger>
              <DropdownMenuSubContent className='max-h-[300px] overflow-y-auto'>
                {placeholders.map((placeholder) => (
                  <DropdownMenuItem
                    key={placeholder.value}
                    onClick={() =>
                      editor
                        .chain()
                        .focus()
                        .insertContent(placeholder.value)
                        .run()
                    }
                  >
                    {placeholder.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuSubContent>
            </DropdownMenuSub>
          </DropdownMenuContent>
        </DropdownMenu>

        <Button variant='ghost' size='sm' onClick={setLink} title='Add Link'>
          <Link2 className='h-4 w-4' />
        </Button>
      </div>
      <div className='flex-grow' /> {/* Spacer */}
      {/* --- Group: Utilities --- */}
      <div className='flex gap-1'>
        <Button
          variant='ghost'
          size='sm'
          onClick={() =>
            editor.chain().focus().unsetAllMarks().clearNodes().run()
          }
          title='Clear Formatting'
        >
          <Eraser className='h-4 w-4' />
        </Button>
      </div>
    </div>
  );
};

export default TiptapToolbar;
