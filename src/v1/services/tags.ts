import { ITag, Tags } from '../models';
import { logger } from '../../logger';
import { Request } from 'express';
import { HTTPError } from '../../http-error';
import { ExpressQuery, ResponseJson, TagData, PagingData } from './';

export class TagsService {
  public static async getAllTags(req: Request<{}, {}, {}, ExpressQuery>) : Promise<ResponseJson> {
    try {
      const limit : number = parseInt(req.query.limit);
      const offset : number = parseInt(req.query.offset);

      const data : ITag[] = await Tags.find()
        .limit(limit)
        .skip(offset);

      const total : number = data.length;
      const totalPages : number = Math.ceil(total / limit) || 1;
      const currentPage : number = Math.ceil(total % offset) || 1;

      const parsedData : TagData[] = data.map(tag  => { 
        return this.getTagData(tag);
      });

      const paging : PagingData = {
        total,
        page: currentPage,
        pages: totalPages
      };
  
      const responseJson : ResponseJson = {
        message: "Successfully retrieved all leetcode tags",
        tags: parsedData,
        paging
      }
  
      return responseJson;
    } catch(e : any) {
      logger.error("Exception caught retrieving leetcode problems from database: " + e);
      throw new HTTPError("Error retrieving problems " + e, 500);
    }
  }

  private static getTagData(tag: ITag) : TagData {
    return {
      id: tag.tagId,
      name: tag.name,
      name_slug: tag.nameSlug,
      number_of_problems: tag.numberOfProblems
    };
  }
}
