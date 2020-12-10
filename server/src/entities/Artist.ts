import { BaseEntity, Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm'
import { Song } from './Song'

@Entity()
export class Artist extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  name: string

  @Column({ nullable: true })
  origin: string

  @OneToMany(type => Song, song => song.artist)
  songs: Song[]

  // get isStarted() {
  //   return this.currQuestion != null
  // }

  // get isCompleted() {
  //   return this.isStarted && this.currQuestion >= this.questions.length
  // }

  // get currentQuestion() {
  //   if (!this.isStarted || this.isCompleted) {
  //     return null
  //   }

  //   return this.questions.sort((a, b) => a.id - b.id)[this.currQuestion]
  // }
}
