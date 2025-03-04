import React, { useState, useEffect, useCallback } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Highlight from '@tiptap/extension-highlight';
import Typography from '@tiptap/extension-typography';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import TextAlign from '@tiptap/extension-text-align';
import { motion, AnimatePresence } from 'framer-motion';
import CardContainer from './CardContainer';

// TipTap Toolbar Button Component
const MenuButton = ({ onClick, isActive = false, disabled = false, children, title }) => (
    <button
        onClick={onClick}
        disabled={disabled}
        className={`p-2 rounded-md transition-colors ${isActive
            ? 'bg-emerald-100 text-emerald-600'
            : 'text-gray-600 hover:bg-gray-100'
            } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
        title={title}
    >
        {children}
    </button>
);

// TipTap Editor Toolbar Component
const EditorMenu = ({ editor }) => {
    if (!editor) return null;

    return (
        <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="border border-gray-200 rounded-t-lg bg-gray-50 p-1 flex flex-wrap gap-1 sticky top-0 z-10"
        >
            <MenuButton
                onClick={() => editor.chain().focus().toggleBold().run()}
                isActive={editor.isActive('bold')}
                title="Bold"
            >
                <span className="font-bold">B</span>
            </MenuButton>

            <MenuButton
                onClick={() => editor.chain().focus().toggleItalic().run()}
                isActive={editor.isActive('italic')}
                title="Italic"
            >
                <span className="italic">I</span>
            </MenuButton>

            <MenuButton
                onClick={() => editor.chain().focus().toggleStrike().run()}
                isActive={editor.isActive('strike')}
                title="Strikethrough"
            >
                <span className="line-through">S</span>
            </MenuButton>

            <MenuButton
                onClick={() => editor.chain().focus().toggleHighlight().run()}
                isActive={editor.isActive('highlight')}
                title="Highlight"
            >
                <span className="bg-yellow-200 px-1">H</span>
            </MenuButton>

            <span className="w-px h-6 bg-gray-300 mx-1"></span>

            <MenuButton
                onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                isActive={editor.isActive('heading', { level: 1 })}
                title="Heading 1"
            >
                <span className="font-bold">H1</span>
            </MenuButton>

            <MenuButton
                onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                isActive={editor.isActive('heading', { level: 2 })}
                title="Heading 2"
            >
                <span className="font-bold">H2</span>
            </MenuButton>

            <MenuButton
                onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                isActive={editor.isActive('heading', { level: 3 })}
                title="Heading 3"
            >
                <span className="font-bold">H3</span>
            </MenuButton>

            <span className="w-px h-6 bg-gray-300 mx-1"></span>

            <MenuButton
                onClick={() => editor.chain().focus().toggleBulletList().run()}
                isActive={editor.isActive('bulletList')}
                title="Bullet List"
            >
                <span className="font-bold">• List</span>
            </MenuButton>

            <MenuButton
                onClick={() => editor.chain().focus().toggleOrderedList().run()}
                isActive={editor.isActive('orderedList')}
                title="Ordered List"
            >
                <span className="font-bold">1. List</span>
            </MenuButton>

            <span className="w-px h-6 bg-gray-300 mx-1"></span>

            <MenuButton
                onClick={() => editor.chain().focus().toggleBlockquote().run()}
                isActive={editor.isActive('blockquote')}
                title="Blockquote"
            >
                <span className="font-bold">"</span>
            </MenuButton>

            <MenuButton
                onClick={() => editor.chain().focus().setTextAlign('left').run()}
                isActive={editor.isActive({ textAlign: 'left' })}
                title="Align Left"
            >
                <span>←</span>
            </MenuButton>

            <MenuButton
                onClick={() => editor.chain().focus().setTextAlign('center').run()}
                isActive={editor.isActive({ textAlign: 'center' })}
                title="Align Center"
            >
                <span>↔</span>
            </MenuButton>

            <MenuButton
                onClick={() => editor.chain().focus().setTextAlign('right').run()}
                isActive={editor.isActive({ textAlign: 'right' })}
                title="Align Right"
            >
                <span>→</span>
            </MenuButton>

            <span className="w-px h-6 bg-gray-300 mx-1"></span>

            <MenuButton
                onClick={() => {
                    const url = window.prompt('URL');
                    if (url) {
                        editor.chain().focus().setLink({ href: url }).run();
                    }
                }}
                isActive={editor.isActive('link')}
                title="Add Link"
            >
                <span className="underline">Link</span>
            </MenuButton>

            <MenuButton
                onClick={() => editor.chain().focus().undo().run()}
                disabled={!editor.can().undo()}
                title="Undo"
            >
                <span>↩</span>
            </MenuButton>

            <MenuButton
                onClick={() => editor.chain().focus().redo().run()}
                disabled={!editor.can().redo()}
                title="Redo"
            >
                <span>↪</span>
            </MenuButton>
        </motion.div>
    );
};

// Custom CSS for TipTap editor and content display
const editorStyles = `
  /* Shared styles for both editor and display mode */
  .ProseMirror, .ProseMirror-content {
    min-height: 200px;
    padding: 1rem;
    outline: none;
  }
  
  .ProseMirror {
    border: 1px solid #e5e7eb;
    border-top: none;
    border-bottom-left-radius: 0.5rem;
    border-bottom-right-radius: 0.5rem;
  }
  
  /* Basic spacing */
  .ProseMirror > * + *, .ProseMirror-content > * + * {
    margin-top: 0.75em;
  }
  
  /* Lists styling - applied to both editor and display mode */
  .ProseMirror ul, .ProseMirror ol, .ProseMirror-content ul, .ProseMirror-content ol {
    padding-left: 1.5rem;
    margin-bottom: 1rem;
  }
  
  .ProseMirror ul, .ProseMirror-content ul {
    list-style-type: disc;
  }
  
  .ProseMirror ol, .ProseMirror-content ol {
    list-style-type: decimal;
  }
  
  .ProseMirror ul ul, .ProseMirror ol ul, .ProseMirror-content ul ul, .ProseMirror-content ol ul {
    list-style-type: circle;
  }
  
  .ProseMirror ul ol, .ProseMirror ol ol, .ProseMirror-content ul ol, .ProseMirror-content ol ol {
    list-style-type: lower-alpha;
  }
  
  .ProseMirror li, .ProseMirror-content li {
    margin-bottom: 0.25rem;
  }
  
  /* Headings */
  .ProseMirror h1, .ProseMirror-content h1 {
    font-size: 1.875rem;
    line-height: 2.25rem;
    font-weight: 700;
    margin-top: 1.5rem;
    margin-bottom: 1rem;
  }
  
  .ProseMirror h2, .ProseMirror-content h2 {
    font-size: 1.5rem;
    line-height: 2rem;
    font-weight: 700;
    margin-top: 1.5rem;
    margin-bottom: 0.75rem;
  }
  
  .ProseMirror h3, .ProseMirror-content h3 {
    font-size: 1.25rem;
    line-height: 1.75rem;
    font-weight: 600;
    margin-top: 1.25rem;
    margin-bottom: 0.75rem;
  }
  
  /* Blockquotes */
  .ProseMirror blockquote, .ProseMirror-content blockquote {
    padding-left: 1rem;
    border-left: 2px solid #e5e7eb;
    color: #6b7280;
    font-style: italic;
    margin: 1rem 0;
  }
  
  /* Text alignment */
  .ProseMirror p.has-text-align-center, .ProseMirror-content p.has-text-align-center {
    text-align: center;
  }
  
  .ProseMirror p.has-text-align-right, .ProseMirror-content p.has-text-align-right {
    text-align: right;
  }
  
  /* Images */
  .ProseMirror img, .ProseMirror-content img {
    max-width: 100%;
    height: auto;
    border-radius: 0.25rem;
  }
  
  /* Links */
  .ProseMirror a, .ProseMirror-content a {
    color: #2563eb;
    text-decoration: underline;
  }
  
  /* Highlight */
  .ProseMirror mark, .ProseMirror-content mark {
    background-color: #fef3c7;
    padding: 0.125rem 0;
  }
`;

const RichTextCard = ({
    initialValue,
    onDelete,
    onSave,
    isCollapsed = false,
    onToggleCollapse
}) => {
    const [editionMode, setEditionMode] = useState(initialValue.editionMode || false);
    const [content, setContent] = useState(initialValue);
    const [originalContent, setOriginalContent] = useState(initialValue);

    // Configure TipTap editor
    const editor = useEditor({
        extensions: [
            StarterKit,
            Highlight,
            Typography,
            Image,
            Link,
            TextAlign.configure({
                types: ['heading', 'paragraph'],
            }),
        ],
        content: content.content || '<p>Start writing...</p>',
        onUpdate: ({ editor }) => {
            setContent(prev => ({
                ...prev,
                content: editor.getHTML()
            }));
        },
        editable: editionMode
    });

    // Update editor content when editionMode changes
    useEffect(() => {
        if (editor) {
            editor.setEditable(editionMode);
        }
    }, [editor, editionMode]);

    // Update editor content when content changes externally
    useEffect(() => {
        if (editor && content.content !== editor.getHTML()) {
            editor.commands.setContent(content.content || '<p>Start writing...</p>');
        }
    }, [editor, content.content]);

    // Add custom styles to document
    useEffect(() => {
        const styleElement = document.createElement('style');
        styleElement.textContent = editorStyles + `
      /* Additional display mode fixes */
      .rich-text-display ul {
        list-style-type: disc !important;
        padding-left: 1.5rem !important;
        margin-bottom: 1rem !important;
      }
      
      .rich-text-display ol {
        list-style-type: decimal !important;
        padding-left: 1.5rem !important;
        margin-bottom: 1rem !important;
      }
      
      .rich-text-display li {
        display: list-item !important;
        margin-bottom: 0.25rem !important;
      }

      /* Override any Tailwind reset that might be affecting lists */
      .rich-text-display ul li::before,
      .rich-text-display ol li::before {
        content: none !important;
      }
    `;
        document.head.appendChild(styleElement);

        return () => {
            document.head.removeChild(styleElement);
        };
    }, []);

    // Handle title changes
    const handleTitleChange = (title) => {
        setContent(prev => ({ ...prev, title }));
    };

    // Save changes
    const handleSave = () => {
        const updatedContent = {
            ...content,
            editionMode: false
        };

        setEditionMode(false);
        setContent(updatedContent);

        if (onSave) {
            onSave(updatedContent);
        }
    };

    // Cancel edits
    const handleCancel = () => {
        setContent(originalContent);
        setEditionMode(false);
        if (editor) {
            editor.commands.setContent(originalContent.content || '<p>Start writing...</p>');
        }
    };

    // Enter edit mode
    const handleEdit = () => {
        setOriginalContent(content);
        setEditionMode(true);
    };

    // Word count estimation
    const getWordCount = () => {
        if (!content.content) return 0;
        // Strip HTML and count words
        const text = content.content.replace(/<[^>]*>/g, ' ');
        return text.split(/\s+/).filter(word => word.length > 0).length;
    };

    // Generate a preview text for collapsed state
    const getPreviewContent = () => {
        if (!content.content) return "No content";

        // Convert HTML to text
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = content.content;
        const textContent = tempDiv.textContent || tempDiv.innerText || '';

        // Return a preview of the first ~100 characters
        return (
            <div className="text-sm">
                <p className="text-gray-600 line-clamp-3">
                    {textContent.trim().substring(0, 150)}
                    {textContent.length > 150 ? '...' : ''}
                </p>
                <div className="mt-1 text-xs text-gray-500">
                    ~{getWordCount()} words
                </div>
            </div>
        );
    };

    return (
        <CardContainer
            title={content.title || 'Untitled Document'}
            type="RICH_TEXT"
            editionMode={editionMode}
            setEditionMode={setEditionMode}
            onSave={handleSave}
            onDelete={onDelete}
            onCancel={handleCancel}
            createdAt={initialValue.createdAt}
            updatedAt={initialValue.updatedAt}
            isCollapsed={isCollapsed}
            onToggleCollapse={onToggleCollapse}
        >
            {isCollapsed ? (
                // Simplified preview content for collapsed state
                getPreviewContent()
            ) : (
                // Full content for expanded state
                <AnimatePresence mode="wait" initial={false}>
                    {editionMode ? (
                        <motion.div
                            key="edit-mode"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.3 }}
                        >
                            <div className="mb-4">
                                <input
                                    type="text"
                                    value={content.title || ''}
                                    onChange={(e) => handleTitleChange(e.target.value)}
                                    className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/40 text-gray-700 font-medium"
                                    placeholder="Document title..."
                                />
                            </div>

                            <div className="mb-4 rounded-lg overflow-hidden">
                                <EditorMenu editor={editor} />
                                <EditorContent editor={editor} className="transition-all duration-300" />
                            </div>

                            <div className="mt-2 text-right text-xs text-gray-500">
                                ~{getWordCount()} words
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="view-mode"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="rich-text-display"
                        >
                            {/* Apply both Tailwind prose and our custom ProseMirror-content styles */}
                            <div
                                className="ProseMirror-content prose prose-slate max-w-none"
                                dangerouslySetInnerHTML={{ __html: content.content || '<p>No content</p>' }}
                            />

                            <motion.div
                                initial={{ opacity: 0, y: 5 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2, duration: 0.3 }}
                                className="mt-4 flex justify-between text-xs text-gray-500 border-t border-gray-100 pt-2"
                            >
                                <div>
                                    ~{getWordCount()} words
                                </div>
                                <button
                                    onClick={handleEdit}
                                    className="text-emerald-600 hover:text-emerald-700 font-medium"
                                >
                                    Edit document
                                </button>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
            )}
        </CardContainer>
    );
};

export default RichTextCard;