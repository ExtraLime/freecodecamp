#!/usr/bin/env python3
'''This is a script to append data from multiple txt files to one file.
It was created for consolidating lessons from freecode camp to reduce
the number of total files'''

import glob, os

new_files = glob.glob("*.txt") #gets list of txt files
new_files.sort(key=os.path.getmtime) #sorts by modified time

if 'all_lessons.txt' not in new_files: #creates 'all_lessons.txt' if it does not exist
            with open('all_lessons.txt','w+') as all_lessons:
    	        all_lessons.write('Start\n\n\n')
    	        all_lessons.close()

all_lessons = open('all_lessons.txt','a+') #opens all_lessons.txt file

for file in new_files: #iterates through file list
        if file == 'all_lessons.txt': #skips file "all_lessons"
            pass

        else:
            with open(file,'r') as current_lesson:
                data = current_lesson.read()  #collects text          
                all_lessons.write('\n\n\t'+file+'\n\n'+data+'\n\n\n') #wrties text
            current_lesson.close()
            os.remove(file) #deletes file
	
all_lessons.close()

