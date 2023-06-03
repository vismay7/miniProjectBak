import SubTopic from "./SubTopicInterface";

export default interface Topic {
  topic_title: string;
  subtopics: SubTopic[];
}
