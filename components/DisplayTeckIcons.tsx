import { cn , getTechLogos } from '@/lib/actions/utils';
import Image from 'next/image';
import React from 'react';

const DisplayTeckIcons = async ({techStack} : TechIconProps) => {
  
  const teckIcons = await getTechLogos(techStack);
    return (
    <div className="flex flex-row">
      {teckIcons.slice(0,3).map(({ tech , url} , index) => (
<div
          key={tech}
          className={cn(
            "relative group bg-dark-300 rounded-full p-2 flex flex-center",
            index >= 1 && "-ml-2"
          )}
        >            <span className="tech-tooltip">{tech}</span>
            <Image src= {url} alt={tech} width={100} height={100} className="size-5" />
        </div>
      ))}
    </div>
  )
}

export default DisplayTeckIcons
