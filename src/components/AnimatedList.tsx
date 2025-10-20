import React, { useRef, useState, useEffect, ReactNode, MouseEventHandler, UIEvent } from 'react';
import { motion, useInView } from 'motion/react';

interface AnimatedItemProps {
  children: ReactNode;
  delay?: number;
  index: number;
  onMouseEnter?: MouseEventHandler<HTMLDivElement>;
  onClick?: MouseEventHandler<HTMLDivElement>;
}

const AnimatedItem: React.FC<AnimatedItemProps> = ({ children, delay = 0, index, onMouseEnter, onClick }) => {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.5, once: false });
  return (
    <motion.div
      ref={ref}
      data-index={index}
      onMouseEnter={onMouseEnter}
      onClick={onClick}
      initial={{ scale: 0.7, opacity: 0 }}
      animate={inView ? { scale: 1, opacity: 1 } : { scale: 0.7, opacity: 0 }}
      transition={{ duration: 0.2, delay }}
      className="mb-4 cursor-pointer"
    >
      {children}
    </motion.div>
  );
};

export interface FAQItem {
  question: string;
  answer: string;
  category?: string;
  benefit?: string;
}

interface AnimatedListProps {
  items?: string[] | FAQItem[];
  onItemSelect?: (item: string | FAQItem, index: number) => void;
  showGradients?: boolean;
  enableArrowNavigation?: boolean;
  className?: string;
  itemClassName?: string;
  displayScrollbar?: boolean;
  initialSelectedIndex?: number;
  isFAQMode?: boolean;
  selectedFAQIndex?: number;
  onFAQSelect?: (index: number) => void;
}

const AnimatedList: React.FC<AnimatedListProps> = ({
  items = [
    'Item 1',
    'Item 2',
    'Item 3',
    'Item 4',
    'Item 5',
    'Item 6',
    'Item 7',
    'Item 8',
    'Item 9',
    'Item 10',
    'Item 11',
    'Item 12',
    'Item 13',
    'Item 14',
    'Item 15'
  ],
  onItemSelect,
  showGradients = true,
  enableArrowNavigation = true,
  className = '',
  itemClassName = '',
  displayScrollbar = true,
  initialSelectedIndex = -1,
  isFAQMode = false,
  selectedFAQIndex,
  onFAQSelect
}) => {
  const listRef = useRef<HTMLDivElement>(null);
  const [selectedIndex, setSelectedIndex] = useState<number>(initialSelectedIndex);
  const [keyboardNav, setKeyboardNav] = useState<boolean>(false);
  const [topGradientOpacity, setTopGradientOpacity] = useState<number>(0);
  const [bottomGradientOpacity, setBottomGradientOpacity] = useState<number>(1);
  
  // Use selectedFAQIndex for FAQ mode, otherwise use internal selectedIndex
  const currentSelectedIndex = isFAQMode && selectedFAQIndex !== undefined ? selectedFAQIndex : selectedIndex;

  const handleScroll = (e: UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.target as HTMLDivElement;
    setTopGradientOpacity(Math.min(scrollTop / 50, 1));
    const bottomDistance = scrollHeight - (scrollTop + clientHeight);
    setBottomGradientOpacity(scrollHeight <= clientHeight ? 0 : Math.min(bottomDistance / 50, 1));
  };

  useEffect(() => {
    if (!enableArrowNavigation) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown' || (e.key === 'Tab' && !e.shiftKey)) {
        e.preventDefault();
        setKeyboardNav(true);
        const nextIndex = Math.min(currentSelectedIndex + 1, items.length - 1);
        if (isFAQMode && onFAQSelect) {
          onFAQSelect(nextIndex);
        } else {
          setSelectedIndex(nextIndex);
        }
      } else if (e.key === 'ArrowUp' || (e.key === 'Tab' && e.shiftKey)) {
        e.preventDefault();
        setKeyboardNav(true);
        const prevIndex = Math.max(currentSelectedIndex - 1, 0);
        if (isFAQMode && onFAQSelect) {
          onFAQSelect(prevIndex);
        } else {
          setSelectedIndex(prevIndex);
        }
      } else if (e.key === 'Enter') {
        if (currentSelectedIndex >= 0 && currentSelectedIndex < items.length) {
          e.preventDefault();
          if (onItemSelect) {
            onItemSelect(items[currentSelectedIndex], currentSelectedIndex);
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [items, currentSelectedIndex, onItemSelect, enableArrowNavigation, isFAQMode, onFAQSelect]);

  useEffect(() => {
    if (!keyboardNav || currentSelectedIndex < 0 || !listRef.current) return;
    const container = listRef.current;
    const selectedItem = container.querySelector(`[data-index="${currentSelectedIndex}"]`) as HTMLElement | null;
    if (selectedItem) {
      const extraMargin = 50;
      const containerScrollTop = container.scrollTop;
      const containerHeight = container.clientHeight;
      const itemTop = selectedItem.offsetTop;
      const itemBottom = itemTop + selectedItem.offsetHeight;
      if (itemTop < containerScrollTop + extraMargin) {
        container.scrollTo({ top: itemTop - extraMargin, behavior: 'smooth' });
      } else if (itemBottom > containerScrollTop + containerHeight - extraMargin) {
        container.scrollTo({
          top: itemBottom - containerHeight + extraMargin,
          behavior: 'smooth'
        });
      }
    }
    setKeyboardNav(false);
  }, [currentSelectedIndex, keyboardNav]);

  // Helper function to check if item is FAQ
  const isFAQItem = (item: string | FAQItem): item is FAQItem => {
    return typeof item === 'object' && 'question' in item;
  };

  return (
    <div className={`relative ${isFAQMode ? 'w-full max-w-4xl mx-auto' : 'w-[500px]'} ${className}`}>
      <div
        ref={listRef}
        className={`max-h-[400px] overflow-y-auto p-4 ${
          displayScrollbar
            ? isFAQMode 
              ? '[&::-webkit-scrollbar]:w-[8px] [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:bg-gray-300 [&::-webkit-scrollbar-thumb]:rounded-[4px]'
              : '[&::-webkit-scrollbar]:w-[8px] [&::-webkit-scrollbar-track]:bg-[#060010] [&::-webkit-scrollbar-thumb]:bg-[#222] [&::-webkit-scrollbar-thumb]:rounded-[4px]'
            : 'scrollbar-hide'
        }`}
        onScroll={handleScroll}
        style={{
          scrollbarWidth: displayScrollbar ? 'thin' : 'none',
          scrollbarColor: isFAQMode ? '#d1d5db #f3f4f6' : '#222 #060010'
        }}
      >
        {items.map((item, index) => (
          <AnimatedItem
            key={index}
            delay={0.1}
            index={index}
            onMouseEnter={() => {
              if (isFAQMode && onFAQSelect) {
                onFAQSelect(index);
              } else {
                setSelectedIndex(index);
              }
            }}
            onClick={() => {
              if (isFAQMode && onFAQSelect) {
                onFAQSelect(index);
              } else {
                setSelectedIndex(index);
              }
              if (onItemSelect) {
                onItemSelect(item, index);
              }
            }}
          >
            {isFAQItem(item) ? (
              <div className={`p-6 bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 ${currentSelectedIndex === index ? 'ring-2 ring-blue-500 shadow-lg' : ''} ${itemClassName}`}>
                <div className="flex-1 pr-4">
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-1">
                    {item.question}
                  </h3>
                  {item.benefit && (
                    <p className="text-sm text-blue-600 font-medium">
                      {item.benefit}
                    </p>
                  )}
                </div>
              </div>
            ) : (
              <div className={`p-4 ${isFAQMode ? 'bg-white border border-gray-200' : 'bg-[#111]'} rounded-lg ${currentSelectedIndex === index ? (isFAQMode ? 'ring-2 ring-blue-500' : 'bg-[#222]') : ''} ${itemClassName}`}>
                <p className={`${isFAQMode ? 'text-gray-900' : 'text-white'} m-0`}>{item}</p>
              </div>
            )}
          </AnimatedItem>
        ))}
      </div>
      {showGradients && (
        <>
          <div
            className={`absolute top-0 left-0 right-0 h-[50px] bg-gradient-to-b pointer-events-none transition-opacity duration-300 ease ${isFAQMode ? 'from-gray-50 to-transparent' : 'from-[#060010] to-transparent'}`}
            style={{ opacity: topGradientOpacity }}
          ></div>
          <div
            className={`absolute bottom-0 left-0 right-0 h-[100px] bg-gradient-to-t pointer-events-none transition-opacity duration-300 ease ${isFAQMode ? 'from-gray-50 to-transparent' : 'from-[#060010] to-transparent'}`}
            style={{ opacity: bottomGradientOpacity }}
          ></div>
        </>
      )}
    </div>
  );
};

export default AnimatedList;
